"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { updateInquirySchema } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

// ---------- Admin: list inquiries ----------
export async function getAllInquiries(options: {
  page?: number;
  limit?: number;
  status?: "NEW" | "IN_PROGRESS" | "RESOLVED";
  search?: string;
} = {}) {
  const session = await auth();
  if (!session) {
    return { ok: false as const, error: "Unauthorized" };
  }

  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));

  const where: Prisma.InquiryWhereInput = {};
  if (options.status) where.status = options.status;
  if (options.search) {
    where.OR = [
      { name: { contains: options.search, mode: "insensitive" } },
      { email: { contains: options.search, mode: "insensitive" } },
      { subject: { contains: options.search, mode: "insensitive" } },
    ];
  }

  const [inquiries, total] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.inquiry.count({ where }),
  ]);

  return {
    ok: true as const,
    inquiries: inquiries.map((i) => ({
      ...i,
      createdAt: i.createdAt.toISOString(),
      updatedAt: i.updatedAt.toISOString(),
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

// ---------- Admin: get single inquiry ----------
export async function getInquiry(id: string) {
  const session = await auth();
  if (!session) {
    return { ok: false as const, error: "Unauthorized" };
  }

  const inquiry = await prisma.inquiry.findUnique({ where: { id } });
  if (!inquiry) {
    return { ok: false as const, error: "Inquiry not found" };
  }

  return { ok: true as const, inquiry };
}

// ---------- Admin: update status ----------
export async function updateInquiryStatus(id: string, status: "NEW" | "IN_PROGRESS" | "RESOLVED") {
  const session = await auth();
  if (!session) {
    return { ok: false as const, error: "Unauthorized" };
  }

  const parsed = updateInquirySchema.safeParse({ status });
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid status" };
  }

  try {
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return { ok: true as const, inquiry };
  } catch (err) {
    return {
      ok: false as const,
      error: err instanceof Error ? err.message : "Failed to update inquiry",
    };
  }
}

// ---------- Admin: delete inquiry ----------
export async function deleteInquiry(id: string) {
  const session = await auth();
  if (!session) {
    return { ok: false as const, error: "Unauthorized" };
  }

  try {
    await prisma.inquiry.delete({ where: { id } });
    return { ok: true as const };
  } catch (err) {
    return {
      ok: false as const,
      error: err instanceof Error ? err.message : "Failed to delete inquiry",
    };
  }
}

// ---------- Admin: inquiry stats ----------
export async function getInquiryStatsAction() {
  const session = await auth();
  if (!session) {
    return { ok: false as const, error: "Unauthorized" };
  }

  const [total, newCount, inProgressCount, resolvedCount, spamCount] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.inquiry.count({ where: { status: "IN_PROGRESS" } }),
    prisma.inquiry.count({ where: { status: "RESOLVED" } }),
    prisma.inquiry.count({ where: { isSpam: true } }),
  ]);

  return {
    ok: true as const,
    stats: { total, newCount, inProgressCount, resolvedCount, spamCount },
  };
}
