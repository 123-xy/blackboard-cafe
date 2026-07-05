import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/booking";
import { availabilityQuerySchema } from "@/lib/validations";

export const runtime = "nodejs";

// GET /api/availability?date=YYYY-MM-DD
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  const parsed = availabilityQuerySchema.safeParse({ date });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid date", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const slots = await getAvailableSlots(parsed.data.date);
    return NextResponse.json({ date: parsed.data.date, slots });
  } catch (err) {
    console.error("[api] Availability error:", err);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
