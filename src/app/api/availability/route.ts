import { NextResponse } from "next/server";
import { getUpcomingAvailability } from "@/lib/availability-store";
import { listAllBookings } from "@/lib/bookings-store";
import { getPartyConfig } from "@/lib/party-config";
import { dailyBookingLimit, isDateWithinBookingRules } from "@/lib/booking-rules";

// Public endpoint: only exposes what the booking form needs (date, time
// window, capacity, remaining seats, open/closed) — never customer PII,
// which lives only in `bookings` and is never queried with the anon key.
export async function GET() {
  try {
    const [slots, bookings, config] = await Promise.all([
      getUpcomingAvailability(),
      listAllBookings().catch(() => []),
      getPartyConfig(),
    ]);
    const activeByDate = new Map<string, number>();
    bookings.filter((b) => b.status !== "cancelled").forEach((b) => activeByDate.set(b.date, (activeByDate.get(b.date) ?? 0) + 1));
    return NextResponse.json({
      slots: slots.map((s) => {
        const remainingBookings = Math.max(0, dailyBookingLimit(s.date, config) - (activeByDate.get(s.date) ?? 0));
        return ({
        id: s.id,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        capacity: s.capacity,
        remaining: Math.max(0, s.remaining),
        isAvailable: s.isAvailable,
        remainingBookings,
        isWithinRules: isDateWithinBookingRules(s.date, config),
      })}),
      rules: { minimumAdvanceDays: config.minimumAdvanceDays, bookingStartDate: config.bookingStartDate, bookingEndDate: config.bookingEndDate },
    });
  } catch (err) {
    console.error("[availability] failed to load availability", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
