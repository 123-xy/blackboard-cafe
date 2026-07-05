import disposableDomains from "disposable-email-domains";
import { prisma } from "@/lib/db";

const DISPOSABLE_DOMAINS = new Set(disposableDomains as string[]);

const SPAM_KEYWORDS = [
  "viagra",
  "cialis",
  "casino",
  "crypto airdrop",
  "make money fast",
  "click here",
  "work from home",
  "seo services",
  "backlink",
  "bitcoin investment",
  "forex trading",
  "loan approved",
  "weight loss pill",
  "nigerian prince",
  "wire transfer",
  "act now",
  "100% free",
  "risk free",
  "guaranteed income",
];

const URL_PATTERN = /https?:\/\/|www\./gi;

function getDomain(email: string): string {
  return email.split("@")[1]?.toLowerCase().trim() ?? "";
}

export function isDisposableEmail(email: string): boolean {
  return DISPOSABLE_DOMAINS.has(getDomain(email));
}

function countKeywordHits(text: string): number {
  const lower = text.toLowerCase();
  return SPAM_KEYWORDS.reduce((count, kw) => (lower.includes(kw) ? count + 1 : count), 0);
}

async function isDuplicateMessage(email: string, message: string): Promise<boolean> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const existing = await prisma.inquiry.findFirst({
    where: {
      email,
      message,
      createdAt: { gte: since },
    },
    select: { id: true },
  });
  return existing !== null;
}

export type SpamCheckInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type SpamCheckResult = {
  spamScore: number;
  isSpam: boolean;
};

/**
 * Scores 0-100. >= 50 is flagged as spam.
 * Runs entirely on heuristics that don't require any external service,
 * so it always works regardless of which optional integrations are configured.
 */
export async function checkForSpam(input: SpamCheckInput): Promise<SpamCheckResult> {
  let score = 0;

  if (isDisposableEmail(input.email)) score += 40;

  const keywordHits = countKeywordHits(`${input.subject} ${input.message}`);
  score += Math.min(40, keywordHits * 15);

  const urlMatches = input.message.match(URL_PATTERN);
  if (urlMatches && urlMatches.length >= 2) score += 25;
  else if (urlMatches && urlMatches.length === 1) score += 10;

  if (/(.)\1{7,}/.test(input.message)) score += 15; // repeated character spam
  if (input.message.trim().length < 20) score += 10;
  if (/^[A-Z\s!]{15,}$/.test(input.message)) score += 10; // all caps shouting

  try {
    if (await isDuplicateMessage(input.email, input.message)) score += 30;
  } catch (err) {
    console.error("[spam] Duplicate check failed:", err);
  }

  score = Math.min(100, score);

  return { spamScore: score, isSpam: score >= 50 };
}
