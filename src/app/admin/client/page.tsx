import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, Clock3, ClipboardList } from "lucide-react";
import { getAdminRole } from "@/lib/admin-auth";
import { getPartyConfig } from "@/lib/party-config";
import { listAllBookings, type Booking } from "@/lib/bookings-store";
import PartyChoicesEditor from "@/components/admin/PartyChoicesEditor";
import { logoutAction } from "../actions";
import { updateClientPartyConfig } from "./actions";

export const metadata:Metadata={title:"Gestione prenotazioni · Momopolis Admin",robots:{index:false,follow:false}};

function formatAdminDate(value:string){const [year,month,day]=value.split("-");return `${day}.${month}.${year}`}
const statusLabels:Record<Booking["status"],string>={pending:"In attesa",confirmed:"Confermata",cancelled:"Rifiutata"};
const statusStyles:Record<Booking["status"],string>={pending:"bg-momo-orange/10 text-momo-orange",confirmed:"bg-momo-green-700/10 text-momo-green-700",cancelled:"bg-black/5 text-momo-black/45"};

export default async function ClientAdminPage({searchParams}:{searchParams:Promise<{saved?:string}>}) {
  const role=await getAdminRole();
  if(!role)redirect("/admin/client/login");
  const [config,bookings]=await Promise.all([getPartyConfig(),listAllBookings()]);
  const {saved}=await searchParams;
  const cards=[
    {title:"1. Calendario",text:"Aggiungi, blocca o elimina le date disponibili.",href:"/admin/availability#calendario",Icon:CalendarDays},
    {title:"2. Prenotazioni",text:"Consulta le richieste e tutte le scelte effettuate.",href:"#prenotazioni",Icon:ClipboardList},
    {title:"3. Orari e chiusure",text:"Gestisci periodi, giorni chiusi, prezzi e opzioni del preventivatore.",href:"#orari",Icon:Clock3},
  ];
  return <div className="min-h-screen bg-momo-cream pb-20"><div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-momo-orange">Momòpolis Admin</p><h1 className="font-display text-3xl font-extrabold">Gestione prenotazioni</h1><p className="mt-1 text-sm text-momo-black/55">Accesso operativo limitato. Foto, pagine e contenuti generali restano riservati all’owner.</p></div><div className="flex gap-2">{role==="owner"&&<Link href="/admin" className="rounded-full border border-black/15 px-4 py-2 text-sm font-extrabold">Admin completo</Link>}<form action={logoutAction}><button className="rounded-full bg-momo-black px-4 py-2 text-sm font-extrabold text-white">Esci</button></form></div></header>
    {saved&&<p className="mt-6 rounded-xl bg-momo-green-700/10 px-4 py-3 text-sm font-bold text-momo-green-700">Modifiche salvate.</p>}
    <div className="mt-8 grid gap-4 md:grid-cols-3">{cards.map(({title,text,href,Icon})=><Link key={title} href={href} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-momo-orange"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-momo-green-neon"><Icon/></span><h2 className="font-display mt-5 text-xl font-extrabold">{title}</h2><p className="mt-2 text-sm text-momo-black/60">{text}</p></Link>)}</div>
    <section id="prenotazioni" className="mt-12 scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-display text-2xl font-extrabold">Prenotazioni ricevute</h2><p className="mt-1 text-sm text-momo-black/55">Apri una richiesta per vedere tutte le informazioni e le opzioni selezionate.</p></div><Link href="/admin/availability#prenotazioni" className="rounded-full bg-momo-black px-5 py-2.5 text-sm font-extrabold text-white">Gestisci date e stato</Link></div>
      {bookings.length===0?<p className="mt-5 rounded-3xl border border-dashed border-black/15 bg-white p-8 text-center text-sm text-momo-black/50">Non ci sono ancora prenotazioni.</p>:<div className="mt-5 space-y-3">{bookings.map(booking=><details key={booking.id} className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"><summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3 px-5 py-4"><div><p className="font-display text-lg font-extrabold">{booking.name}</p><p className="mt-1 text-sm text-momo-black/55">{formatAdminDate(booking.date)} · {booking.participants} persone · {booking.partyType}</p></div><div className="flex items-center gap-3"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[booking.status]}`}>{statusLabels[booking.status]}</span><span className="text-momo-black/35 transition-transform group-open:rotate-180">▾</span></div></summary><div className="border-t border-black/5 px-5 py-5"><div className="grid gap-3 text-sm sm:grid-cols-2"><p><b>E-mail:</b> <a className="underline" href={`mailto:${booking.email}`}>{booking.email}</a></p><p><b>Telefono:</b> <a className="underline" href={`tel:${booking.phone}`}>{booking.phone}</a></p><p><b>Data richiesta:</b> {new Intl.DateTimeFormat("it-CH",{dateStyle:"medium",timeStyle:"short"}).format(new Date(booking.createdAt))}</p><p><b>Codice:</b> {booking.id.split("-")[0].toUpperCase()}</p></div>{booking.message&&<div className="mt-5 rounded-2xl bg-momo-cream-dim p-4"><p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-momo-black/45">Dettagli e scelte del preventivo</p><pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-momo-black/75">{booking.message}</pre></div>}</div></details>)}</div>}
    </section>
    <section id="orari" className="mt-12 scroll-mt-24"><h2 className="font-display text-2xl font-extrabold">Orari, chiusure e preventivatore</h2><form action={updateClientPartyConfig} className="mt-5 space-y-7 rounded-3xl border border-black/10 bg-white p-5 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Prenotabile dal"><input name="bookingStartDate" type="date" required defaultValue={config.bookingStartDate} className="momo-input"/></Field>
        <Field label="Prenotabile fino al"><input name="bookingEndDate" type="date" defaultValue={config.bookingEndDate} className="momo-input"/></Field>
        <Field label="Anticipo minimo (giorni)"><input name="minimumAdvanceDays" type="number" min="0" defaultValue={config.minimumAdvanceDays} className="momo-input"/></Field>
        <Field label="Giorni chiusi (0=dom, 1=lun...) "><input name="closedWeekdays" defaultValue={config.closedWeekdays.join(",")} className="momo-input"/></Field>
        <Field label="Max prenotazioni feriali"><input name="weekdayMaxBookings" type="number" min="1" defaultValue={config.weekdayMaxBookings} className="momo-input"/></Field>
        <Field label="Max weekend/festivi"><input name="weekendMaxBookings" type="number" min="1" defaultValue={config.weekendMaxBookings} className="momo-input"/></Field>
        <Field label="Date festive aggiuntive" className="sm:col-span-2"><input name="holidayDates" defaultValue={config.holidayDates.map(formatAdminDate).join(", ")} placeholder="25.12.2026" className="momo-input"/></Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[
        ["morningWeekdayPrice","Mattina feriale",config.morningWeekdayPrice],["morningHolidayPrice","Mattina weekend/festivi",config.morningHolidayPrice],["afternoonWeekdayPrice","Pomeriggio feriale",config.afternoonWeekdayPrice],["afternoonHolidayPrice","Pomeriggio weekend/festivi",config.afternoonHolidayPrice],["fullDayWeekdayPrice","Giornata feriale",config.fullDayWeekdayPrice],["fullDayHolidayPrice","Giornata weekend/festivi",config.fullDayHolidayPrice],["adultPrice","Quota adulto",config.adultPrice],
      ].map(([name,label,value])=><Field key={String(name)} label={`${label} (CHF)`}><input name={String(name)} type="number" min="0" step="0.5" defaultValue={Number(value)} className="momo-input"/></Field>)}</div>
      <PartyChoicesEditor name="packages" label="Pacchetti" initial={config.packages}/><PartyChoicesEditor name="cakes" label="Torte" initial={config.cakes}/><PartyChoicesEditor name="extras" label="Extra" initial={config.extras}/><PartyChoicesEditor name="setups" label="Allestimenti" initial={config.setups}/>
      <button className="rounded-full bg-momo-orange px-6 py-3 font-extrabold">Salva configurazione</button>
    </form></section>
  </div></div>;
}

function Field({label,children,className=""}:{label:string;children:React.ReactNode;className?:string}){return <label className={`block text-sm font-bold ${className}`}><span className="mb-1.5 block">{label}</span>{children}</label>}
