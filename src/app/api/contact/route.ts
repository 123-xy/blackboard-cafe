import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "venuacha@whiteboard.cafe";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "Blackboard Cafe Website <onboarding@resend.dev>";

type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  cateringType: string;
  guestCount: string;
  message: string;
};

const REQUIRED_STRING_FIELDS = ["name", "phone", "cateringType", "guestCount", "message"] as const;

function isValidPayload(value: unknown): value is ContactPayload {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  const hasAllRequiredStrings = REQUIRED_STRING_FIELDS.every(
    (field) => typeof v[field] === "string" && (v[field] as string).trim().length > 0,
  );
  return (
    hasAllRequiredStrings &&
    typeof v.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error("contact route: RESEND_API_KEY is not configured");
    return NextResponse.json(
      { error: "Contact form is not configured." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const { name, phone, email, cateringType, guestCount, message } = body;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New enquiry — Blackboard Cafe website (${name})`,
        html: `
          <h2>New enquiry from the Blackboard Cafe website</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Catering Type:</strong> ${escapeHtml(cateringType)}</p>
          <p><strong>Estimated Guest Count:</strong> ${escapeHtml(guestCount)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
        `,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("contact route: Resend error", res.status, detail);
      return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact route error", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
  }
}
