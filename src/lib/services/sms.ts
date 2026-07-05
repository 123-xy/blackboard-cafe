import { formatDate, formatTime } from "@/lib/utils";

export async function sendReservationSMS(reservation: {
  phone: string;
  guests: number;
  reservationDate: Date | string;
  reservationTime: string;
  confirmationCode: string;
}) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.error("[sms] Twilio credentials not configured");
    return;
  }

  const dateStr = formatDate(reservation.reservationDate);
  const timeStr = formatTime(reservation.reservationTime);

  const body = [
    `✅ Your reservation at Blackboard Cafe is confirmed!`,
    ``,
    `📅 Date: ${dateStr}`,
    `🕐 Time: ${timeStr}`,
    `👥 Guests: ${reservation.guests}`,
    ``,
    `🔖 Confirmation: ${reservation.confirmationCode}`,
    ``,
    `Great Food, Great Life`,
  ].join("\n");

  // Normalize phone to E.164 format
  let toNumber = reservation.phone.replace(/[\s-]/g, "");
  if (!toNumber.startsWith("+")) {
    toNumber = "+91" + toNumber; // Default to India
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const params = new URLSearchParams({
      To: toNumber,
      From: fromNumber,
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
      console.error("[sms] Twilio error", res.status, detail);
    }
  } catch (err) {
    console.error("[sms] Failed to send", err);
  }
}
