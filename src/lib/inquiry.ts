import { prisma } from "@/lib/db";
import { checkForSpam } from "@/lib/spam";
import { sendOwnerNotification, sendCustomerAutoReply } from "@/lib/services/contact-email";
import type { InquiryInput } from "@/lib/validations";

export type CreateInquiryMeta = {
  ipAddress: string | null;
  userAgent: string | null;
};

export async function createInquiry(data: InquiryInput, meta: CreateInquiryMeta) {
  const { spamScore, isSpam } = await checkForSpam({
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
  });

  const inquiry = await prisma.inquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
      spamScore,
      isSpam,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    },
  });

  // Fire-and-forget notifications. Obvious spam never reaches the owner's
  // inbox, but we still store the inquiry so it's reviewable in the dashboard.
  if (!isSpam) {
    const emailData = {
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      subject: inquiry.subject,
      message: inquiry.message,
      createdAt: inquiry.createdAt,
    };

    Promise.allSettled([sendOwnerNotification(emailData), sendCustomerAutoReply(emailData)]).catch((err) =>
      console.error("[inquiry] Notification error:", err)
    );
  }

  return inquiry;
}
