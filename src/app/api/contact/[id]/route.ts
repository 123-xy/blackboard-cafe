import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { updateInquirySchema } from "@/lib/validations";

export const runtime = "nodejs";

// GET /api/contact/:id — Fetch a single inquiry (admin only)
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const inquiry = await prisma.inquiry.findUnique({ where: { id } });
  if (!inquiry) {
    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
  }

  return NextResponse.json({ inquiry });
}

// PATCH /api/contact/:id — Update inquiry status (admin only)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateInquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json({ ok: true, inquiry: updated });
  } catch (err) {
    console.error("[api] PATCH inquiry error:", err);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

// DELETE /api/contact/:id — Delete an inquiry (admin only)
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const inquiry = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    await prisma.inquiry.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api] DELETE inquiry error:", err);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
