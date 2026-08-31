import "server-only";
import { supabase, isSupabaseConfigured } from "./supabase";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  id: string;
  availabilityId: string | null;
  name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  startTime: string | null; // HH:MM:SS
  endTime: string | null;
  partyType: string;
  participants: number;
  message?: string;
  locale: string;
  status: BookingStatus;
  createdAt: string;
};

type BookingRow = {
  id: string;
  availability_id: string | null;
  name: string;
  email: string;
  phone: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  party_type: string;
  participants: number;
  message: string | null;
  locale: string;
  status: BookingStatus;
  created_at: string;
};

function fromRow(row: BookingRow): Booking {
  return {
    id: row.id,
    availabilityId: row.availability_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    partyType: row.party_type,
    participants: row.participants,
    message: row.message ?? undefined,
    locale: row.locale,
    status: row.status,
    createdAt: row.created_at,
  };
}

/**
 * The one entry point for creating a booking. Delegates to the `create_booking`
 * Postgres function (see supabase/booking_availability.sql), which locks the
 * availability row and re-checks remaining seats inside the same transaction —
 * this is what actually prevents overbooking under concurrent requests, not
 * anything in this file. Requires Supabase (no local fallback: the capacity
 * model needs a real transaction).
 */
export async function createBookingAtomic(input: {
  availabilityId: string;
  name: string;
  email: string;
  phone: string;
  participants: number;
  partyType: string;
  message?: string;
  locale: string;
}): Promise<Booking> {
  if (!isSupabaseConfigured) {
    throw new Error("SUPABASE_REQUIRED");
  }

  const { data, error } = await supabase!
    .rpc("create_booking", {
      p_availability_id: input.availabilityId,
      p_name: input.name,
      p_email: input.email,
      p_phone: input.phone,
      p_participants: input.participants,
      p_party_type: input.partyType,
      p_message: input.message ?? null,
      p_locale: input.locale,
    })
    .single();

  if (error) {
    // Exceptions raised inside create_booking() surface here with our
    // custom message (AVAILABILITY_NOT_FOUND / AVAILABILITY_CLOSED / etc).
    throw new Error(error.message);
  }

  const created = fromRow(data as BookingRow);
  // Compatibility with projects where the database function predates the
  // admin approval workflow and still creates rows as `confirmed`.
  if (created.status !== "pending") {
    const { error: pendingError } = await supabase!
      .from("bookings")
      .update({ status: "pending" })
      .eq("id", created.id);
    if (pendingError) throw pendingError;
    created.status = "pending";
  }
  return created;
}

/** All bookings (every status), newest first — used by the admin dashboard,
 * which groups them by `availabilityId` client-side. */
export async function listAllBookings(): Promise<Booking[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase!
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })
    .abortSignal(AbortSignal.timeout(8000));

  if (error) throw error;
  return (data as BookingRow[]).map(fromRow);
}

export async function cancelBooking(bookingId: string): Promise<void> {
  if (!isSupabaseConfigured) throw new Error("SUPABASE_REQUIRED");

  const { error } = await supabase!
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (error) throw error;
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<void> {
  if (!isSupabaseConfigured) throw new Error("SUPABASE_REQUIRED");
  const { error } = await supabase!.from("bookings").update({ status }).eq("id", bookingId);
  if (error) throw error;
}

export async function moveBooking(bookingId: string, availabilityId: string): Promise<void> {
  if (!isSupabaseConfigured) throw new Error("SUPABASE_REQUIRED");

  const { data: slot, error: slotError } = await supabase!
    .from("booking_availability_status")
    .select("id,date,start_time,end_time,is_available,remaining")
    .eq("id", availabilityId)
    .single();
  if (slotError || !slot) throw slotError ?? new Error("Disponibilità non trovata");

  const { data: booking, error: bookingError } = await supabase!
    .from("bookings")
    .select("participants")
    .eq("id", bookingId)
    .single();
  if (bookingError || !booking) throw bookingError ?? new Error("Prenotazione non trovata");
  if (!slot.is_available || Number(slot.remaining) < Number(booking.participants)) {
    throw new Error("La nuova data non ha posti sufficienti");
  }

  const { error } = await supabase!.from("bookings").update({
    availability_id: availabilityId,
    date: slot.date,
    start_time: slot.start_time,
    end_time: slot.end_time,
  }).eq("id", bookingId);
  if (error) throw error;
}
