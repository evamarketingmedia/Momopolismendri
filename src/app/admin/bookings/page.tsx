import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminRole } from "@/lib/admin-auth";
import { listAllBookings, type Booking } from "@/lib/bookings-store";
import { deleteBookingAction } from "./actions";

export const metadata: Metadata = { title: "Prenotazioni · Momopolis Admin", robots: { index: false, follow: false } };
const statusLabels: Record<Booking["status"], string> = { pending: "In attesa", confirmed: "Confermata", cancelled: "Rifiutata" };
const statusStyles: Record<Booking["status"], string> = { pending: "bg-momo-orange/10 text-momo-orange", confirmed: "bg-momo-green-700/10 text-momo-green-700", cancelled: "bg-black/5 text-momo-black/45" };
function formatDate(value: string) { const [year, month, day] = value.split("-"); return `${day}.${month}.${year}`; }

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const role = await getAdminRole();
  if (!role) redirect("/admin/login");
  const bookings = await listAllBookings();
  const { deleted } = await searchParams;
  return <main className="min-h-screen bg-momo-cream px-5 py-10"><div className="mx-auto max-w-5xl">
    <p className="text-xs font-extrabold uppercase tracking-[.18em] text-momo-orange">Momòpolis Admin</p><h1 className="font-display mt-2 text-3xl font-extrabold">Prenotazioni</h1><p className="mt-2 text-sm text-momo-black/55">Clicca sul nome per visualizzare tutte le informazioni e le scelte effettuate.</p>
    {deleted && <p className="mt-5 rounded-xl bg-momo-green-700/10 px-4 py-3 text-sm font-bold text-momo-green-700">Prenotazione eliminata.</p>}
    {bookings.length === 0 ? <p className="mt-6 rounded-3xl border border-dashed border-black/15 bg-white p-9 text-center text-momo-black/50">Non ci sono ancora prenotazioni.</p> : <div className="mt-6 space-y-3">{bookings.map(booking => <details key={booking.id} className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"><summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-5 py-4"><div><p className="font-display text-lg font-extrabold">{booking.name}</p><p className="mt-1 text-sm text-momo-black/55">{formatDate(booking.date)} · {booking.participants} persone · {booking.partyType}</p></div><div className="flex items-center gap-3"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[booking.status]}`}>{statusLabels[booking.status]}</span><span className="transition-transform group-open:rotate-180">▾</span></div></summary><div className="border-t border-black/5 px-5 py-5"><div className="grid gap-3 text-sm sm:grid-cols-2"><p><b>E-mail:</b> <a className="underline" href={`mailto:${booking.email}`}>{booking.email}</a></p><p><b>Telefono:</b> <a className="underline" href={`tel:${booking.phone}`}>{booking.phone}</a></p><p><b>Inserita il:</b> {new Intl.DateTimeFormat("it-CH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(booking.createdAt))}</p><p><b>Codice:</b> {booking.id.split("-")[0].toUpperCase()}</p></div>{booking.message && <div className="mt-5 rounded-2xl bg-momo-cream-dim p-4"><p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-momo-black/45">Dettagli e scelte del preventivo</p><pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-momo-black/75">{booking.message}</pre></div>}{role === "owner" && <form action={deleteBookingAction} className="mt-5"><input type="hidden" name="booking_id" value={booking.id} /><button className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-extrabold text-red-700">Elimina prenotazione</button></form>}</div></details>)}</div>}
  </div></main>;
}
