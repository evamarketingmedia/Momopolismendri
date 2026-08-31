import { NextResponse } from "next/server";
import { createBookingAtomic } from "@/lib/bookings-store";
import { sendBookingEmails } from "@/lib/email";
import { hasLocale, defaultLocale } from "@/lib/dictionaries";
import { getUpcomingAvailability } from "@/lib/availability-store";
import { listAllBookings } from "@/lib/bookings-store";
import { getPartyConfig } from "@/lib/party-config";
import { dailyBookingLimit, isDateWithinBookingRules } from "@/lib/booking-rules";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const availabilityId = String(body.availabilityId ?? "").trim();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const partyType = String(body.partyType ?? "").trim();
  const participants = Number(body.participants);
  const message = body.message ? String(body.message).trim() : undefined;
  const rawLocale = String(body.locale ?? defaultLocale);
  const locale = hasLocale(rawLocale) ? rawLocale : defaultLocale;
  const bookingBlock = String(body.bookingBlock ?? "");
  const eventName = String(body.eventName ?? "").trim();
  const quoteTotal = Number(body.quoteTotal);

  if (!availabilityId || !UUID_RE.test(availabilityId)) {
    return NextResponse.json({ error: "INVALID_AVAILABILITY" }, { status: 400 });
  }
  if (!name || !email || !phone || !partyType) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }
  if (!['morning','afternoon','full_day'].includes(bookingBlock)) {
    return NextResponse.json({ error: "INVALID_BOOKING_BLOCK" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
  }
  // Authoritative check: capacity is re-verified server-side inside
  // create_booking() regardless of what the client claims here.
  if (!Number.isFinite(participants) || participants < 1) {
    return NextResponse.json({ error: "INVALID_PARTICIPANTS" }, { status: 400 });
  }

  try {
    const [slots, existingBookings, config] = await Promise.all([getUpcomingAvailability(), listAllBookings(), getPartyConfig()]);
    const requestedSlot = slots.find((slot) => slot.id === availabilityId);
    if (!requestedSlot || !isDateWithinBookingRules(requestedSlot.date, config)) {
      return NextResponse.json({ error: "AVAILABILITY_CLOSED" }, { status: 409 });
    }
    const dailyCount = existingBookings.filter((b) => b.date === requestedSlot.date && b.status !== "cancelled").length;
    if (dailyCount >= dailyBookingLimit(requestedSlot.date, config)) {
      return NextResponse.json({ error: "DAILY_LIMIT_REACHED" }, { status: 409 });
    }
    const booking = await createBookingAtomic({
      availabilityId,
      name,
      email,
      phone,
      participants,
      partyType,
      message,
      locale,
    });

    try {
      await sendBookingEmails(booking, { bookingBlock, eventName, quoteTotal: Number.isFinite(quoteTotal) ? quoteTotal : 0 });
    } catch (err) {
      console.error(`[bookings] email dispatch threw for booking ${booking.id}`, err);
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";

    if (message === "AVAILABILITY_NOT_FOUND") {
      return NextResponse.json({ error: "AVAILABILITY_NOT_FOUND" }, { status: 404 });
    }
    if (message === "AVAILABILITY_CLOSED" || message === "NOT_ENOUGH_SEATS" || message === "DAILY_LIMIT_REACHED") {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    if (message === "INVALID_PARTICIPANTS") {
      return NextResponse.json({ error: "INVALID_PARTICIPANTS" }, { status: 400 });
    }
    if (message === "SUPABASE_REQUIRED") {
      console.error("[bookings] Supabase is not configured");
      return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
    }

    console.error("[bookings] failed to create booking", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
