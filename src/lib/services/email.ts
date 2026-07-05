import { formatDate, formatTime } from "@/lib/utils";

const LOGO_URL = "https://blackboard.cafe/images/logo-badge.png";
const GOOGLE_MAPS_URL = "https://maps.google.com/?q=Blackboard+Cafe+Hyderabad+Telangana+India";

export async function sendReservationEmail(reservation: {
  customerName: string;
  email: string;
  guests: number;
  reservationDate: Date | string;
  reservationTime: string;
  confirmationCode: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY not configured");
    return;
  }

  const cancelUrl = `${process.env.NEXTAUTH_URL || "https://blackboard.cafe"}/reservations/cancel?code=${reservation.confirmationCode}`;
  const dateStr = formatDate(reservation.reservationDate);
  const timeStr = formatTime(reservation.reservationTime);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#14120F;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#14120F;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:#1C1A17;border-radius:20px 20px 0 0;padding:40px 40px 24px;text-align:center;">
              <img src="${LOGO_URL}" alt="Blackboard Cafe" width="80" height="80" style="display:block;margin:0 auto 16px;" />
              <h1 style="margin:0;font-size:24px;font-weight:800;color:#F2A93B;letter-spacing:1px;">
                RESERVATION CONFIRMED
              </h1>
              <p style="margin:8px 0 0;font-size:14px;color:#B8B2A8;">
                Your table is booked, ${reservation.customerName}!
              </p>
            </td>
          </tr>

          <!-- Gold divider -->
          <tr>
            <td style="background:#1C1A17;padding:0 40px;">
              <div style="height:3px;background:linear-gradient(90deg,transparent,#F2A93B,transparent);border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Details -->
          <tr>
            <td style="background:#1C1A17;padding:28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #35322C;">
                    <span style="font-size:12px;font-weight:700;color:#B8B2A8;letter-spacing:1px;text-transform:uppercase;">Date</span><br/>
                    <span style="font-size:18px;font-weight:600;color:#FFFFFF;margin-top:4px;display:inline-block;">📅 ${dateStr}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #35322C;">
                    <span style="font-size:12px;font-weight:700;color:#B8B2A8;letter-spacing:1px;text-transform:uppercase;">Time</span><br/>
                    <span style="font-size:18px;font-weight:600;color:#FFFFFF;margin-top:4px;display:inline-block;">🕐 ${timeStr}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #35322C;">
                    <span style="font-size:12px;font-weight:700;color:#B8B2A8;letter-spacing:1px;text-transform:uppercase;">Guests</span><br/>
                    <span style="font-size:18px;font-weight:600;color:#FFFFFF;margin-top:4px;display:inline-block;">👥 ${reservation.guests} ${reservation.guests === 1 ? "Guest" : "Guests"}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <span style="font-size:12px;font-weight:700;color:#B8B2A8;letter-spacing:1px;text-transform:uppercase;">Confirmation Code</span><br/>
                    <span style="font-size:28px;font-weight:800;color:#F2A93B;letter-spacing:4px;margin-top:8px;display:inline-block;">${reservation.confirmationCode}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Buttons -->
          <tr>
            <td style="background:#1C1A17;padding:8px 40px 36px;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px;" align="center">
                    <a href="${GOOGLE_MAPS_URL}" target="_blank" style="display:inline-block;background:#F2A93B;color:#1C1A17;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;letter-spacing:0.5px;">
                      📍 VIEW ON GOOGLE MAPS
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px;" align="center">
                    <a href="${cancelUrl}" target="_blank" style="display:inline-block;background:transparent;color:#B8B2A8;font-size:13px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:10px;border:1.5px solid #35322C;">
                      Cancel Reservation
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#242220;border-radius:0 0 20px 20px;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#8A8478;">
                Blackboard Cafe · Hyderabad, Telangana, India<br/>
                Great Food, Great Life
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#5a564f;">
                © 2026 Bevgo Ventures Pvt. Ltd. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Blackboard Cafe <onboarding@resend.dev>",
        to: [reservation.email],
        subject: `Reservation Confirmed — ${reservation.confirmationCode} | Blackboard Cafe`,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[email] Resend error", res.status, detail);
    }
  } catch (err) {
    console.error("[email] Failed to send", err);
  }
}
