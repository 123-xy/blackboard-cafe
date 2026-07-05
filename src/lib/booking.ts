import { prisma } from "@/lib/db";
import { generateConfirmationCode } from "@/lib/utils";
import { sendReservationEmail } from "@/lib/services/email";
import { sendReservationSMS } from "@/lib/services/sms";
import { sendReservationWhatsApp } from "@/lib/services/whatsapp";
import type { ReservationInput } from "@/lib/validations";

// ---------- Settings ----------
export async function getSettings() {
  let settings = await prisma.restaurantSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.restaurantSettings.create({
      data: { id: "default" },
    });
  }

  return settings;
}

// ---------- Time slot generation ----------
function generateTimeSlots(openingTime: string, closingTime: string, slotDuration: number): string[] {
  const slots: string[] = [];
  const [openH, openM] = openingTime.split(":").map(Number);
  const [closeH, closeM] = closingTime.split(":").map(Number);

  let currentMinutes = openH * 60 + openM;
  const closingMinutes = closeH * 60 + closeM;

  // Last bookable slot should be at least slotDuration before closing
  while (currentMinutes + slotDuration <= closingMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    currentMinutes += slotDuration;
  }

  return slots;
}

// ---------- Availability check ----------
export async function checkAvailability(date: string, time: string) {
  const settings = await getSettings();

  // Check if time is within operating hours
  const [openH, openM] = settings.openingTime.split(":").map(Number);
  const [closeH, closeM] = settings.closingTime.split(":").map(Number);
  const [reqH, reqM] = time.split(":").map(Number);

  const reqMinutes = reqH * 60 + reqM;
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (reqMinutes < openMinutes || reqMinutes + settings.slotDuration > closeMinutes) {
    return { available: false, remainingSlots: 0, reason: "Outside operating hours" };
  }

  // Count non-cancelled reservations for this slot
  const reservationDate = new Date(date + "T00:00:00.000Z");
  const count = await prisma.reservation.count({
    where: {
      reservationDate,
      reservationTime: time,
      status: { not: "CANCELLED" },
    },
  });

  const remaining = settings.tablesAvailable - count;

  return {
    available: remaining > 0,
    remainingSlots: Math.max(0, remaining),
    reason: remaining <= 0 ? "Selected time is unavailable." : null,
  };
}

// ---------- Get all available slots for a date ----------
export async function getAvailableSlots(date: string) {
  const settings = await getSettings();
  const slots = generateTimeSlots(settings.openingTime, settings.closingTime, settings.slotDuration);

  const reservationDate = new Date(date + "T00:00:00.000Z");

  // Get counts for all non-cancelled reservations on this date
  const reservations = await prisma.reservation.groupBy({
    by: ["reservationTime"],
    where: {
      reservationDate,
      status: { not: "CANCELLED" },
    },
    _count: { id: true },
  });

  const countMap = new Map<string, number>();
  for (const r of reservations) {
    countMap.set(r.reservationTime, r._count.id);
  }

  return slots.map((slot) => {
    const booked = countMap.get(slot) || 0;
    const remaining = settings.tablesAvailable - booked;
    return {
      time: slot,
      available: remaining > 0,
      remainingSlots: Math.max(0, remaining),
      totalSlots: settings.tablesAvailable,
    };
  });
}

// ---------- Create reservation ----------
export async function createReservation(data: ReservationInput) {
  const settings = await getSettings();

  // Validate max guests
  if (data.guests > settings.maxGuestsPerBooking) {
    throw new Error(`Maximum ${settings.maxGuestsPerBooking} guests per booking`);
  }

  // Check availability
  const availability = await checkAvailability(data.reservationDate, data.reservationTime);
  if (!availability.available) {
    throw new Error(availability.reason || "Selected time is unavailable.");
  }

  // Check for duplicate booking (same email, date, time, not cancelled)
  const reservationDate = new Date(data.reservationDate + "T00:00:00.000Z");
  const existing = await prisma.reservation.findFirst({
    where: {
      email: data.email,
      reservationDate,
      reservationTime: data.reservationTime,
      status: { not: "CANCELLED" },
    },
  });

  if (existing) {
    throw new Error("You already have a reservation for this time slot.");
  }

  // Generate confirmation code
  const confirmationCode = generateConfirmationCode();

  // Create reservation
  const reservation = await prisma.reservation.create({
    data: {
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      guests: data.guests,
      reservationDate,
      reservationTime: data.reservationTime,
      notes: data.notes || "",
      confirmationCode,
    },
  });

  // Fire-and-forget: send notifications
  const notificationData = {
    customerName: reservation.customerName,
    email: reservation.email,
    phone: reservation.phone,
    guests: reservation.guests,
    reservationDate: reservation.reservationDate,
    reservationTime: reservation.reservationTime,
    confirmationCode: reservation.confirmationCode,
  };

  // Don't await — run in background
  Promise.allSettled([
    sendReservationEmail(notificationData),
    sendReservationSMS(notificationData),
    sendReservationWhatsApp(notificationData),
  ]).catch((err) => console.error("[booking] Notification error:", err));

  return reservation;
}

// ---------- Cancel reservation by code ----------
export async function cancelReservationByCode(code: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { confirmationCode: code },
  });

  if (!reservation) {
    throw new Error("Reservation not found.");
  }

  if (reservation.status === "CANCELLED") {
    throw new Error("This reservation is already cancelled.");
  }

  if (reservation.status === "COMPLETED") {
    throw new Error("This reservation has already been completed and can no longer be cancelled.");
  }

  const updated = await prisma.reservation.update({
    where: { id: reservation.id },
    data: { status: "CANCELLED" },
  });

  return updated;
}

// ---------- Get reservation by code ----------
export async function getReservationByCode(code: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { confirmationCode: code },
  });

  if (!reservation) {
    throw new Error("Reservation not found.");
  }

  return reservation;
}

// ---------- Auto-complete past reservations ----------
// A confirmed booking whose date/time has already passed is done — flip it to
// COMPLETED so the dashboard reflects reality. Called opportunistically
// whenever reservations are listed, rather than via a background cron job.
export async function autoCompletePastReservations() {
  const now = new Date();
  const todayKey = now.toISOString().split("T")[0];
  const todayDate = new Date(todayKey + "T00:00:00.000Z");
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  await prisma.reservation.updateMany({
    where: {
      status: "CONFIRMED",
      OR: [
        { reservationDate: { lt: todayDate } },
        { reservationDate: todayDate, reservationTime: { lte: currentTime } },
      ],
    },
    data: { status: "COMPLETED" },
  });
}
