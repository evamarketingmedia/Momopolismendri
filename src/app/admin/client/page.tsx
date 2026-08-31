import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, Clock3, ClipboardList } from "lucide-react";
import { getAdminRole } from "@/lib/admin-auth";
import { getPartyConfig } from "@/lib/party-config";
import PartyChoicesEditor from "@/components/admin/PartyChoicesEditor";
import { logoutAction } from "../actions";
import { updateClientPartyConfig } from "./actions";

export const metadata:Metadata={title:"Gestione prenotazioni · Momopolis Admin",robots:{index:false,follow:false}};

function formatAdminDate(value:string){const [year,month,day]=value.split("-");return `${day}.${month}.${year}`}

export default async function ClientAdminPage({searchParams}:{searchParams:Promise<{saved?:string}>}) {
  const role=await getAdminRole();
  if(!role)redirect("/admin/client/login");
  const config=await getPartyConfig();
  const {saved}=await searchParams;
  const cards=[
    {title:"1. Calendario",text:"Aggiungi, blocca o elimina le date disponibili.",href:"/admin/availability#calendario",Icon:CalendarDays},
    {title:"2. Prenotazioni",text:"Accetta, rifiuta o sposta le richieste ricevute.",href:"/admin/availability#prenotazioni",Icon:ClipboardList},
    {title:"3. Orari e chiusure",text:"Gestisci periodi, giorni chiusi, prezzi e opzioni del preventivatore.",href:"#orari",Icon:Clock3},
  ];
  return <div className="min-h-screen bg-momo-cream pb-20"><div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-momo-orange">Momòpolis Admin</p><h1 className="font-display text-3xl font-extrabold">Gestione prenotazioni</h1><p className="mt-1 text-sm text-momo-black/55">Accesso operativo limitato. Foto, pagine e contenuti generali restano riservati all’owner.</p></div><div className="flex gap-2">{role==="owner"&&<Link href="/admin" className="rounded-full border border-black/15 px-4 py-2 text-sm font-extrabold">Admin completo</Link>}<form action={logoutAction}><button className="rounded-full bg-momo-black px-4 py-2 text-sm font-extrabold text-white">Esci</button></form></div></header>
    {saved&&<p className="mt-6 rounded-xl bg-momo-green-700/10 px-4 py-3 text-sm font-bold text-momo-green-700">Modifiche salvate.</p>}
    <div className="mt-8 grid gap-4 md:grid-cols-3">{cards.map(({title,text,href,Icon})=><Link key={title} href={href} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-momo-orange"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-momo-green-neon"><Icon/></span><h2 className="font-display mt-5 text-xl font-extrabold">{title}</h2><p className="mt-2 text-sm text-momo-black/60">{text}</p></Link>)}</div>
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
