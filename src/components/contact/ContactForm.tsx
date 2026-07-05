"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

const CATERING_TYPES = [
  "Corporate Catering",
  "Institutional Catering",
  "Event & Exhibition",
  "Café & Dining",
  "General Enquiry",
];

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const fieldClasses =
  "w-full rounded-[10px] border-[1.5px] border-card-border bg-cream-input px-4 py-3.5 font-body text-sm text-heading focus:border-gold focus:outline-none";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

function loadRecaptchaScript(siteKey: string): Promise<void> {
  return new Promise((resolve) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

async function getRecaptchaToken(): Promise<string | undefined> {
  if (!RECAPTCHA_SITE_KEY) return undefined;
  try {
    await loadRecaptchaScript(RECAPTCHA_SITE_KEY);
    return await new Promise<string>((resolve, reject) => {
      window.grecaptcha!.ready(() => {
        window
          .grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action: "contact_submit" })
          .then(resolve)
          .catch(reject);
      });
    });
  } catch {
    return undefined;
  }
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (RECAPTCHA_SITE_KEY) loadRecaptchaScript(RECAPTCHA_SITE_KEY);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorMessage("");
    try {
      const form = formRef.current;
      if (!form) throw new Error("Missing form");
      const formData = new FormData(form);

      // Honeypot: if this hidden field has a value, a bot filled it in.
      if (String(formData.get("website") || "").length > 0) {
        setStatus("success");
        return;
      }

      const recaptchaToken = await getRecaptchaToken();

      const payload = {
        name: String(formData.get("name") || ""),
        phone: String(formData.get("phone") || ""),
        email: String(formData.get("email") || ""),
        cateringType: String(formData.get("cateringType") || ""),
        guestCount: String(formData.get("guestCount") || ""),
        message: String(formData.get("message") || ""),
        website: "",
        recaptchaToken,
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Request failed");
      }
      setStatus("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "");
      setStatus("error");
    }
  };

  const sending = status === "sending";

  return (
    <div className="rounded-[20px] border border-card-border bg-surface p-11">
      <h2 className="m-0 mb-7 font-display text-2xl font-bold text-heading">Send us a message</h2>

      {status !== "success" ? (
        <form ref={formRef} onSubmit={handleSubmit}>
          {/* Honeypot field — hidden from real users, invisible to screen readers */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
            <label htmlFor="website">Website</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="mb-5 grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-heading">Name</label>
              <input name="name" type="text" required placeholder="Your name" className={fieldClasses} />
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-heading">Phone</label>
              <input name="phone" type="text" required placeholder="Your phone" className={fieldClasses} />
            </div>
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-[13px] font-semibold text-heading">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className={fieldClasses}
            />
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-[13px] font-semibold text-heading">Catering Type</label>
            <select name="cateringType" required defaultValue="" className={fieldClasses}>
              <option value="" disabled>
                Select a service...
              </option>
              {CATERING_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-[13px] font-semibold text-heading">Estimated Guest Count</label>
            <input
              name="guestCount"
              type="text"
              required
              placeholder="e.g. 500 employees, 2,000 students"
              className={fieldClasses}
            />
          </div>
          <div className="mb-7">
            <label className="mb-2 block text-[13px] font-semibold text-heading">Message</label>
            <textarea
              name="message"
              rows={5}
              required
              minLength={20}
              placeholder="Tell us about your enquiry... (at least 20 characters)"
              className={`${fieldClasses} resize-y`}
            />
          </div>

          {status === "error" && (
            <div className="mb-5 text-[13px] text-error">
              {errorMessage || "Something went wrong sending your message — please try again, or email venuacha@whiteboard.cafe directly."}
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="rounded-lg border-none px-9 py-4 font-body text-sm font-bold tracking-[0.5px] text-dark shadow-[0_4px_0_#C97F16]"
            style={{ background: sending ? "#e0cba0" : "#F2A93B", cursor: sending ? "default" : "pointer" }}
          >
            {sending ? "SENDING…" : "SEND MESSAGE"}
          </button>

          {RECAPTCHA_SITE_KEY && (
            <p className="m-0 mt-4 text-[11px] leading-[1.6] text-muted">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-gold-text">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener" className="text-gold-text">
                Terms of Service
              </a>{" "}
              apply.
            </p>
          )}
        </form>
      ) : (
        <div className="py-10 text-center">
          <div className="mb-4 text-4xl">✅</div>
          <div className="mb-2 font-display text-xl font-bold text-heading">Message sent!</div>
          <p className="m-0 text-sm text-muted">Thanks for reaching out — we&apos;ll get back to you soon.</p>
        </div>
      )}
    </div>
  );
}
