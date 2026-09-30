import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminRole } from "@/lib/admin-auth";
import { listAllBookings, type Booking } from "@/lib/bookings-store";
import { acceptBookingAction, deleteBookingAction } from "./actions";

export const metadata: Metadata = { title: "Prenotazioni · Momopolis Admin", robots: { index: false, follow: false } };
const statusLabels: Record<Booking["status"],string>={pending:"In attesa",confirmed:"Confermata",cancelled:"Rifiutata"};
const statusStyles: Record<Booking["status"],string>={pending:"bg-momo-orange/10 text-momo-orange",confirmed:"bg-momo-green-700/10 text-momo-green-700",cancelled:"bg-black/5 text-momo-black/45"};
function formatDate(value:string){const [year,month,day]=value.split("-");return `${day}.${month}.${year}`;}
function field(message:string|undefined,names:string[]){const line=(message||"").split("\n").find(value=>names.some(name=>value.startsWith(`${name}:`)));return line?.slice(line.indexOf(":")+1).trim()||"—";}

function BookingCard({booking}:{booking:Booking}){
  const setup=field(booking.message,["Allestimento","Setup"]);
  const theme=setup.match(/(?:Tema|Theme):\s*(.+)$/i)?.[1]||field(booking.message,["Tema allestimento","Setup theme"]);
  return <details className="group bg-white">
    <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6"><div className="min-w-0"><p className="font-display break-words text-lg font-extrabold">{booking.name}</p><p className="mt-1 text-sm text-momo-black/55">{booking.participants} persone · {booking.partyType}</p></div><div className="flex items-center gap-3"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[booking.status]}`}>{statusLabels[booking.status]}</span><span className="transition-transform group-open:rotate-180">▾</span></div></summary>
    <div className="border-t border-black/5 px-4 py-5 sm:px-6">
      <div className="grid gap-3 break-words text-sm sm:grid-cols-2"><p><b>E-mail:</b> <a className="underline" href={`mailto:${booking.email}`}>{booking.email}</a></p><p><b>Telefono:</b> <a className="underline" href={`tel:${booking.phone}`}>{booking.phone}</a></p><p><b>Inserita il:</b> {new Intl.DateTimeFormat("it-CH",{dateStyle:"medium",timeStyle:"short"}).format(new Date(booking.createdAt))}</p><p><b>Preventivo:</b> {booking.quoteNumber??booking.id.split("-")[0].toUpperCase()}</p></div>
      <div className="mt-5 grid gap-3 rounded-2xl border border-momo-orange/25 bg-momo-orange/5 p-4 sm:grid-cols-2"><p><b>Allestimento:</b> {setup}</p><p><b>Tema selezionato:</b> {theme}</p></div>
      {booking.message&&<div className="mt-5 overflow-x-auto rounded-2xl bg-momo-cream-dim p-4"><p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-momo-black/45">Dettagli e scelte del preventivo</p><pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-momo-black/75">{booking.message}</pre></div>}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">{booking.status!=="confirmed"&&<form action={acceptBookingAction}><input type="hidden" name="booking_id" value={booking.id}/><button className="min-h-11 w-full rounded-full bg-momo-green-700 px-5 py-2 text-sm font-extrabold text-white sm:w-auto">Accetta prenotazione</button></form>}<form action={deleteBookingAction}><input type="hidden" name="booking_id" value={booking.id}/><button className="min-h-11 w-full rounded-full border border-red-200 bg-red-50 px-5 py-2 text-sm font-extrabold text-red-700 sm:w-auto">Elimina prenotazione</button></form></div>
    </div>
  </details>;
}

export default async function BookingsPage({searchParams}:{searchParams:Promise<{deleted?:string;accepted?:string}>}){
  const role=await getAdminRole();if(!role)redirect("/admin/login");
  const bookings=await listAllBookings();const {deleted,accepted}=await searchParams;
  const grouped=bookings.reduce<Record<string,Booking[]>>((result,booking)=>{(result[booking.date]??=[]).push(booking);return result;},{});
  return <main className="min-h-screen bg-momo-cream px-4 py-7 sm:px-5 sm:py-10"><div className="mx-auto max-w-5xl">
    <p className="text-xs font-extrabold uppercase tracking-[.18em] text-momo-orange">Momòpolis Admin</p><h1 className="font-display mt-2 text-3xl font-extrabold">Prenotazioni</h1><p className="mt-2 text-sm text-momo-black/55">Per ogni data trovi subito nomi e quantità. Clicca sul nome per visualizzare tutte le scelte, compresi allestimento e tema.</p>
    {deleted&&<p className="mt-5 rounded-xl bg-momo-green-700/10 px-4 py-3 text-sm font-bold text-momo-green-700">Prenotazione eliminata.</p>}{accepted&&<p className="mt-5 rounded-xl bg-momo-green-700/10 px-4 py-3 text-sm font-bold text-momo-green-700">Prenotazione accettata.</p>}
    {bookings.length===0?<p className="mt-6 rounded-3xl border border-dashed border-black/15 bg-white p-9 text-center text-momo-black/50">Non ci sono ancora prenotazioni.</p>:<div className="mt-6 space-y-7">{Object.entries(grouped).map(([date,items])=>{const active=items.filter(item=>item.status!=="cancelled");const total=active.reduce((sum,item)=>sum+item.participants,0);return <section key={date} className="overflow-hidden rounded-3xl border border-black/10 bg-white/55 shadow-sm"><header className="flex flex-wrap items-center justify-between gap-2 bg-momo-green-neon/15 px-4 py-4 sm:px-6"><h2 className="font-display text-xl font-extrabold">{formatDate(date)}</h2><p className="text-sm font-bold">{active.length} prenotazioni · {total} persone</p></header><div className="divide-y divide-black/5">{items.map(booking=><BookingCard key={booking.id} booking={booking}/>)}</div></section>})}</div>}
  </div></main>;
}
