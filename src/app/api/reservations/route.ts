import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createReservation, autoCompletePastReservations } from "@/lib/booking";
import { reservationSchema } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

export const runtime = "nodejs";

// POST /api/reservations — Create a new reservation (public)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = reservationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const reservation = await createReservation(parsed.data);

    return NextResponse.json(
      {
        ok: true,
        reservation: {
          id: reservation.id,
          confirmationCode: reservation.confirmationCode,
          customerName: reservation.customerName,
          reservationDate: reservation.reservationDate,
          reservationTime: reservation.reservationTime,
          guests: reservation.guests,
          status: reservation.status,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create reservation";
    const status = message.includes("unavailable") || message.includes("already have") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// GET /api/reservations — List reservations (admin only)
export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await autoCompletePastReservations();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const date = searchParams.get("date");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

  const where: Prisma.ReservationWhereInput = {};

  if (status && ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].includes(status)) {
    where.status = status as "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  }

  if (date) {
    where.reservationDate = new Date(date + "T00:00:00.000Z");
  }

  if (search) {
    where.OR = [
      { customerName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { confirmationCode: { contains: search, mode: "insensitive" } },
    ];
  }

  const validSortFields = ["createdAt", "reservationDate", "customerName", "status"];
  const orderField = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  const [reservations, total] = await Promise.all([
    prisma.reservation.findMany({
      where,
      orderBy: { [orderField]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.reservation.count({ where }),
  ]);

  return NextResponse.json({
    reservations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
