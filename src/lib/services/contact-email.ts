const LOGO_URL = "https://blackboard.cafe/images/logo-badge.png";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type InquiryEmailData = {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  createdAt: Date;
};

async function sendViaResend(params: { to: string; replyTo?: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact-email] RESEND_API_KEY not configured");
    return;
  }

  const fromEmail = process.env.CONTACT_FROM_EMAIL || "Blackboard Cafe Website <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [params.to],
        ...(params.replyTo ? { reply_to: params.replyTo } : {}),
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[contact-email] Resend error", res.status, detail);
    }
  } catch (err) {
    console.error("[contact-email] Failed to send", err);
  }
}

// ---------- Owner notification ----------
export async function sendOwnerNotification(data: InquiryEmailData) {
  const ownerEmail = process.env.CONTACT_OWNER_EMAIL || process.env.CONTACT_TO_EMAIL || "venuacha@whiteboard.cafe";
  const dashboardUrl = `${process.env.NEXTAUTH_URL || "https://blackboard.cafe"}/admin`;
  const submittedAt = data.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#14120F;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#14120F;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#1C1A17;border-radius:20px 20px 0 0;padding:36px 40px 20px;text-align:center;">
            <img src="${LOGO_URL}" alt="Blackboard Cafe" width="64" height="64" style="display:block;margin:0 auto 14px;" />
            <h1 style="margin:0;font-size:20px;font-weight:800;color:#F2A93B;letter-spacing:0.5px;">NEW CONTACT INQUIRY</h1>
          </td>
        </tr>
        <tr>
          <td style="background:#1C1A17;padding:0 40px;">
            <div style="height:3px;background:linear-gradient(90deg,transparent,#F2A93B,transparent);border-radius:2px;"></div>
          </td>
        </tr>
        <tr>
          <td style="background:#1C1A17;padding:28px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:10px 0;border-bottom:1px solid #35322C;">
                <span style="font-size:11px;font-weight:700;color:#B8B2A8;letter-spacing:1px;text-transform:uppercase;">Name</span><br/>
                <span style="font-size:16px;font-weight:600;color:#FFFFFF;">${escapeHtml(data.name)}</span>
              </td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #35322C;">
                <span style="font-size:11px;font-weight:700;color:#B8B2A8;letter-spacing:1px;text-transform:uppercase;">Email</span><br/>
                <span style="font-size:16px;font-weight:600;color:#FFFFFF;">${escapeHtml(data.email)}</span>
              </td></tr>
              ${data.phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #35322C;">
                <span style="font-size:11px;font-weight:700;color:#B8B2A8;letter-spacing:1px;text-transform:uppercase;">Phone</span><br/>
                <span style="font-size:16px;font-weight:600;color:#FFFFFF;">${escapeHtml(data.phone)}</span>
              </td></tr>` : ""}
              <tr><td style="padding:10px 0;border-bottom:1px solid #35322C;">
                <span style="font-size:11px;font-weight:700;color:#B8B2A8;letter-spacing:1px;text-transform:uppercase;">Subject</span><br/>
                <span style="font-size:16px;font-weight:600;color:#F2A93B;">${escapeHtml(data.subject)}</span>
              </td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #35322C;">
                <span style="font-size:11px;font-weight:700;color:#B8B2A8;letter-spacing:1px;text-transform:uppercase;">Message</span><br/>
                <span style="font-size:14px;line-height:1.7;color:#EFE9E0;">${escapeHtml(data.message).replace(/\n/g, "<br/>")}</span>
              </td></tr>
              <tr><td style="padding:10px 0;">
                <span style="font-size:11px;font-weight:700;color:#B8B2A8;letter-spacing:1px;text-transform:uppercase;">Submitted</span><br/>
                <span style="font-size:14px;color:#B8B2A8;">${submittedAt}</span>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#1C1A17;padding:8px 40px 32px;text-align:center;">
            <a href="${dashboardUrl}" target="_blank" style="display:inline-block;background:#F2A93B;color:#1C1A17;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;letter-spacing:0.5px;">
              OPEN ADMIN DASHBOARD
            </a>
          </td>
        </tr>
        <tr>
          <td style="background:#242220;border-radius:0 0 20px 20px;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#8A8478;">Blackboard Cafe · Automated notification</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendViaResend({
    to: ownerEmail,
    replyTo: data.email,
    subject: "New Contact Inquiry - Blackboard Cafe",
    html,
  });
}

// ---------- Customer auto-reply ----------
export async function sendCustomerAutoReply(data: InquiryEmailData) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#14120F;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#14120F;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#1C1A17;border-radius:20px 20px 0 0;padding:40px 40px 24px;text-align:center;">
            <img src="${LOGO_URL}" alt="Blackboard Cafe" width="80" height="80" style="display:block;margin:0 auto 16px;" />
            <h1 style="margin:0;font-size:22px;font-weight:800;color:#F2A93B;letter-spacing:0.5px;">THANKS FOR REACHING OUT</h1>
            <p style="margin:8px 0 0;font-size:14px;color:#B8B2A8;">Hi ${escapeHtml(data.name)}, we've received your message.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#1C1A17;padding:0 40px;">
            <div style="height:3px;background:linear-gradient(90deg,transparent,#F2A93B,transparent);border-radius:2px;"></div>
          </td>
        </tr>
        <tr>
          <td style="background:#1C1A17;padding:28px 40px;">
            <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#EFE9E0;">
              Thank you for contacting Blackboard Cafe. Our team typically responds within
              <strong style="color:#F2A93B;">24 hours</strong>. Here's a copy of what you sent us:
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#242220;border-radius:12px;">
              <tr><td style="padding:20px;">
                <span style="font-size:11px;font-weight:700;color:#B8B2A8;letter-spacing:1px;text-transform:uppercase;">Subject</span><br/>
                <span style="font-size:15px;font-weight:600;color:#F2A93B;">${escapeHtml(data.subject)}</span>
                <div style="height:14px;"></div>
                <span style="font-size:11px;font-weight:700;color:#B8B2A8;letter-spacing:1px;text-transform:uppercase;">Your Message</span><br/>
                <span style="font-size:14px;line-height:1.7;color:#EFE9E0;">${escapeHtml(data.message).replace(/\n/g, "<br/>")}</span>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#1C1A17;padding:8px 40px 36px;text-align:center;">
            <p style="margin:0 0 14px;font-size:13px;color:#B8B2A8;">Find us:</p>
            <a href="https://maps.google.com/?q=Blackboard+Cafe+Hyderabad+Telangana+India" target="_blank" style="display:inline-block;background:#F2A93B;color:#1C1A17;font-size:13px;font-weight:700;text-decoration:none;padding:12px 26px;border-radius:10px;">
              📍 VIEW ON GOOGLE MAPS
            </a>
          </td>
        </tr>
        <tr>
          <td style="background:#242220;border-radius:0 0 20px 20px;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#F2A93B;">Great Food, Great Life</p>
            <p style="margin:0;font-size:12px;color:#8A8478;">Blackboard Cafe · Hyderabad, Telangana, India</p>
            <p style="margin:8px 0 0;font-size:11px;color:#5a564f;">© 2026 Bevgo Ventures Pvt. Ltd. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendViaResend({
    to: data.email,
    subject: "We've received your message — Blackboard Cafe",
    html,
  });
}
