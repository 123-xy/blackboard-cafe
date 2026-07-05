"use server";

import { createReservation, cancelReservationByCode, getReservationByCode, autoCompletePastReservations } from "@/lib/booking";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { reservationSchema, confirmationCodeSchema } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

// ---------- Admin: list reservations ----------
export async function getAllReservationsAction(options: {
  page?: number;
  limit?: number;
  status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  search?: string;
  date?: string;
} = {}) {
  const session = await auth();
  if (!session) {
    return { ok: false as const, error: "Unauthorized" };
  }

  await autoCompletePastReservations();

  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));

  const where: Prisma.ReservationWhereInput = {};
  if (options.status) where.status = options.status;
  if (options.date) where.reservationDate = new Date(options.date + "T00:00:00.000Z");
  if (options.search) {
    where.OR = [
      { customerName: { contains: options.search, mode: "insensitive" } },
      { email: { contains: options.search, mode: "insensitive" } },
      { phone: { contains: options.search } },
      { confirmationCode: { contains: options.search, mode: "insensitive" } },
    ];
  }

  const [reservations, total] = await Promise.all([
    prisma.reservation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.reservation.count({ where }),
  ]);

  return {
    ok: true as const,
    reservations: reservations.map((r) => ({
      ...r,
      reservationDate: r.reservationDate.toISOString(),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

// ---------- Public: create reservation ----------
export async function createReservationAction(formData: {
  customerName: string;
  email: string;
  phone: string;
  guests: number;
  reservationDate: string;
  reservationTime: string;
  notes?: string;
}) {
  const parsed = reservationSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const reservation = await createReservation(parsed.data);
    return {
      ok: true as const,
      confirmationCode: reservation.confirmationCode,
      reservationId: reservation.id,
    };
  } catch (err) {
    return {
      ok: false as const,
      error: err instanceof Error ? err.message : "Failed to create reservation",
    };
  }
}

// ---------- Public: cancel reservation ----------
export async function cancelReservationAction(code: string) {
  const parsed = confirmationCodeSchema.safeParse({ code });

  if (!parsed.success) {
    return { ok: false as const, error: "Invalid confirmation code" };
  }

  try {
    await cancelReservationByCode(parsed.data.code);
    return { ok: true as const };
  } catch (err) {
    return {
      ok: false as const,
      error: err instanceof Error ? err.message : "Failed to cancel reservation",
    };
  }
}

// ---------- Public: view reservation ----------
export async function getReservationByCodeAction(code: string) {
  const parsed = confirmationCodeSchema.safeParse({ code });

  if (!parsed.success) {
    return { ok: false as const, error: "Invalid confirmation code" };
  }

  try {
    const reservation = await getReservationByCode(parsed.data.code);
    return {
      ok: true as const,
      reservation: {
        id: reservation.id,
        customerName: reservation.customerName,
        email: reservation.email,
        phone: reservation.phone,
        guests: reservation.guests,
        reservationDate: reservation.reservationDate.toISOString(),
        reservationTime: reservation.reservationTime,
        notes: reservation.notes,
        status: reservation.status,
        confirmationCode: reservation.confirmationCode,
        createdAt: reservation.createdAt.toISOString(),
      },
    };
  } catch (err) {
    return {
      ok: false as const,
      error: err instanceof Error ? err.message : "Reservation not found",
    };
  }
}

// ---------- Admin: update status ----------
export async function updateReservationStatusAction(id: string, status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED") {
  const session = await auth();
  if (!session) {
    return { ok: false as const, error: "Unauthorized" };
  }

  try {
    await prisma.reservation.update({
      where: { id },
      data: { status },
    });
    return { ok: true as const };
  } catch (err) {
    return {
      ok: false as const,
      error: err instanceof Error ? err.message : "Failed to update reservation",
    };
  }
}

// ---------- Admin: delete reservation ----------
export async function deleteReservationAction(id: string) {
  const session = await auth();
  if (!session) {
    return { ok: false as const, error: "Unauthorized" };
  }

  try {
    await prisma.reservation.delete({ where: { id } });
    return { ok: true as const };
  } catch (err) {
    return {
      ok: false as const,
      error: err instanceof Error ? err.message : "Failed to delete reservation",
    };
  }
}

// ---------- Admin: get dashboard stats ----------
export async function getDashboardStatsAction() {
  const session = await auth();
  if (!session) {
    return { ok: false as const, error: "Unauthorized" };
  }

  await autoCompletePastReservations();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const [todayCount, weekCount, confirmedCount, completedCount, cancelledCount, pendingCount] = await Promise.all([
    prisma.reservation.count({
      where: { reservationDate: new Date(today.toISOString().split("T")[0] + "T00:00:00.000Z"), status: { not: "CANCELLED" } },
    }),
    prisma.reservation.count({
      where: {
        reservationDate: {
          gte: new Date(today.toISOString().split("T")[0] + "T00:00:00.000Z"),
          lte: new Date(weekEnd.toISOString().split("T")[0] + "T00:00:00.000Z"),
        },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.reservation.count({ where: { status: "CONFIRMED" } }),
    prisma.reservation.count({ where: { status: "COMPLETED" } }),
    prisma.reservation.count({ where: { status: "CANCELLED" } }),
    prisma.reservation.count({ where: { status: "PENDING" } }),
  ]);

  return {
    ok: true as const,
    stats: { todayCount, weekCount, confirmedCount, completedCount, cancelledCount, pendingCount },
  };
}

// ---------- Admin: reservation counts per day for a calendar month ----------
export async function getMonthReservationCountsAction(year: number, month: number) {
  const session = await auth();
  if (!session) {
    return { ok: false as const, error: "Unauthorized" };
  }

  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 1));

  const reservations = await prisma.reservation.findMany({
    where: {
      reservationDate: { gte: start, lt: end },
      status: { not: "CANCELLED" },
    },
    select: { reservationDate: true },
  });

  const counts: Record<string, number> = {};
  for (const r of reservations) {
    const key = r.reservationDate.toISOString().split("T")[0];
    counts[key] = (counts[key] || 0) + 1;
  }

  return { ok: true as const, counts };
}
