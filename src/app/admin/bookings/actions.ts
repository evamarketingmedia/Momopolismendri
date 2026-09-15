"use server";

import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/admin-auth";
import { deleteBooking } from "@/lib/bookings-store";
import { revalidatePublicSite } from "@/lib/revalidate-site";

export async function deleteBookingAction(formData: FormData) {
  await requireOwner();
  const bookingId = String(formData.get("booking_id") ?? "");
  if (!bookingId) throw new Error("Prenotazione non valida");
  await deleteBooking(bookingId);
  revalidatePublicSite();
  redirect("/admin/bookings?deleted=1");
}
