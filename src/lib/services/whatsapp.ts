import { formatDate, formatTime } from "@/lib/utils";

export async function sendReservationWhatsApp(reservation: {
  phone: string;
  customerName: string;
  guests: number;
  reservationDate: Date | string;
  reservationTime: string;
  confirmationCode: string;
}) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !fromWhatsApp) {
    console.error("[whatsapp] Twilio WhatsApp credentials not configured");
    return;
  }

  const dateStr = formatDate(reservation.reservationDate);
  const timeStr = formatTime(reservation.reservationTime);

  const body = [
    `🎉 *Reservation Confirmed!*`,
    ``,
    `Hi ${reservation.customerName}, your table at *Blackboard Cafe* is booked!`,
    ``,
    `📅 *Date:* ${dateStr}`,
    `🕐 *Time:* ${timeStr}`,
    `👥 *Guests:* ${reservation.guests}`,
    `🔖 *Confirmation:* ${reservation.confirmationCode}`,
    ``,
    `📍 _Blackboard Cafe, Hyderabad, Telangana_`,
    ``,
    `Great Food, Great Life ☕`,
  ].join("\n");

  // Normalize phone to E.164 format
  let toNumber = reservation.phone.replace(/[\s-]/g, "");
  if (!toNumber.startsWith("+")) {
    toNumber = "+91" + toNumber;
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const params = new URLSearchParams({
      To: `whatsapp:${toNumber}`,
      From: `whatsapp:${fromWhatsApp}`,
      Body: body,
    });

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[whatsapp] Twilio error", res.status, detail);
    }
  } catch (err) {
    console.error("[whatsapp] Failed to send", err);
  }
}
