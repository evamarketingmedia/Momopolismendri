"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteBooking, updateBookingStatus } from "@/lib/bookings-store";
import { revalidatePublicSite } from "@/lib/revalidate-site";

export async function deleteBookingAction(formData: FormData) {
  await requireAdmin();
  const bookingId = String(formData.get("booking_id") ?? "");
  if (!bookingId) throw new Error("Prenotazione non valida");
  await deleteBooking(bookingId);
  revalidatePublicSite();
  redirect("/admin/bookings?deleted=1");
}

export async function acceptBookingAction(formData: FormData) {
  await requireAdmin();
  const bookingId = String(formData.get("booking_id") ?? "");
  if (!bookingId) throw new Error("Prenotazione non valida");
  await updateBookingStatus(bookingId, "confirmed");
  revalidatePublicSite();
  redirect("/admin/bookings?accepted=1");
}
