import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { updateReservationSchema } from "@/lib/validations";

export const runtime = "nodejs";

// PATCH /api/reservations/:id — Update reservation status (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateReservationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json({ ok: true, reservation: updated });
  } catch (err) {
    console.error("[api] PATCH reservation error:", err);
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 });
  }
}

// DELETE /api/reservations/:id — Delete reservation (admin only)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    await prisma.reservation.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api] DELETE reservation error:", err);
    return NextResponse.json({ error: "Failed to delete reservation" }, { status: 500 });
  }
}
