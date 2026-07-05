import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createInquiry } from "@/lib/inquiry";
import { inquirySchema } from "@/lib/validations";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { checkContactRateLimit } from "@/lib/rate-limit";
import type { Prisma } from "@prisma/client";

export const runtime = "nodejs";

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

// The existing Contact page form collects cateringType + guestCount instead
// of a generic "subject" — this maps those fields onto the Inquiry model
// without changing the form's UI: cateringType becomes the subject line, and
// guestCount is folded into the stored message so nothing is lost.
function toInquiryPayload(body: Record<string, unknown>) {
  const cateringType = typeof body.cateringType === "string" ? body.cateringType : undefined;
  const guestCount = typeof body.guestCount === "string" ? body.guestCount : undefined;
  const message = typeof body.message === "string" ? body.message : "";

  return {
    ...body,
    subject: typeof body.subject === "string" && body.subject ? body.subject : cateringType || "General Enquiry",
    message: guestCount ? `Estimated guest count: ${guestCount}\n\n${message}` : message,
  };
}

// POST /api/contact — Create a new inquiry (public)
export async function POST(request: Request) {
  const ip = getClientIp(request);

  try {
    const rateLimit = await checkContactRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many messages sent. Please try again in a while." },
        { status: 429 }
      );
    }

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (typeof rawBody !== "object" || rawBody === null) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const parsed = inquirySchema.safeParse(toInquiryPayload(rawBody as Record<string, unknown>));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Honeypot: real visitors never fill this hidden field.
    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    const recaptcha = await verifyRecaptcha(parsed.data.recaptchaToken, "contact_submit");
    if (!recaptcha.passed) {
      return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
    }

    const inquiry = await createInquiry(parsed.data, {
      ipAddress: ip,
      userAgent: request.headers.get("user-agent"),
    });

    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error("[api] Contact POST error:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}

// GET /api/contact — List inquiries (admin only)
export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

  const where: Prisma.InquiryWhereInput = {};

  if (status && ["NEW", "IN_PROGRESS", "RESOLVED"].includes(status)) {
    where.status = status as "NEW" | "IN_PROGRESS" | "RESOLVED";
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { subject: { contains: search, mode: "insensitive" } },
    ];
  }

  const validSortFields = ["createdAt", "name", "status", "spamScore"];
  const orderField = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  const [inquiries, total] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      orderBy: { [orderField]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.inquiry.count({ where }),
  ]);

  return NextResponse.json({
    inquiries,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
