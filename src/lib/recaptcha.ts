const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const MIN_SCORE = 0.5;

type GoogleRecaptchaResponse = {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
};

export type RecaptchaResult = {
  passed: boolean;
  score: number | null;
  reason?: string;
};

/**
 * Verifies a reCAPTCHA v3 token server-side. If RECAPTCHA_SECRET_KEY isn't
 * configured, verification is skipped (passed=true) rather than blocking
 * submissions — same graceful-degradation pattern used elsewhere in this
 * project for optional integrations.
 */
export async function verifyRecaptcha(token: string | undefined, expectedAction: string): Promise<RecaptchaResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    return { passed: true, score: null };
  }

  if (!token) {
    return { passed: false, score: null, reason: "Missing reCAPTCHA token" };
  }

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: token }),
    });

    const data = (await res.json()) as GoogleRecaptchaResponse;

    if (!data.success) {
      return { passed: false, score: null, reason: data["error-codes"]?.join(", ") || "Verification failed" };
    }

    if (data.action !== expectedAction) {
      return { passed: false, score: data.score ?? null, reason: "Action mismatch" };
    }

    const score = data.score ?? 0;
    return { passed: score >= MIN_SCORE, score, reason: score < MIN_SCORE ? "Score too low" : undefined };
  } catch (err) {
    console.error("[recaptcha] Verification request failed:", err);
    // Fail open: a transient network error to Google shouldn't block a legitimate submission.
    return { passed: true, score: null, reason: "Verification request failed" };
  }
}
