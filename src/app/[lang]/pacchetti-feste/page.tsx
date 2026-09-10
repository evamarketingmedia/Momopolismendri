import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Phone, WandSparkles } from "lucide-react";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { getPartyConfig } from "@/lib/party-config";
import { getUpcomingAvailability } from "@/lib/availability-store";
import { isDateWithinBookingRules } from "@/lib/booking-rules";
import { siteConfig } from "@/lib/site-config";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import BookingForm from "@/components/BookingForm";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{const {lang}=await params;if(!hasLocale(lang))return{};return{title:lang==="it"?"Compleanni ed eventi":"Birthdays and events",description:lang==="it"?"Feste di compleanno ed eventi personalizzati da Momòpolis a Mendrisio.":"Birthday parties and custom events at Momòpolis in Mendrisio."};}

export default async function PartiesPage({params}:{params:Promise<{lang:string}>}) {
  const {lang}=await params;if(!hasLocale(lang))notFound();const locale=lang as Locale;const dict=await getDictionary(locale);const config=await getPartyConfig();const availability=await getUpcomingAvailability().catch(()=>[]);const initialSlots=availability.map(slot=>({...slot,remainingBookings:1,isWithinRules:isDateWithinBookingRules(slot.date,config)}));const it=locale==="it";
  return <>
    <PageHero kicker={it?"Compleanni ed eventi":"Birthdays and events"} title={it?"Trasforma la tua festa in un ricordo speciale.":"Turn your party into a special memory."} intro={it?"Da Momòpolis - Family Bar & Park ogni occasione diventa un'esperienza unica da condividere con chi ami.":"At Momòpolis - Family Bar & Park every occasion becomes a unique experience to share with those you love."}/>
    <section className="pb-10 pt-12"><Container><div className="mx-auto max-w-4xl text-center"><p className="text-lg leading-relaxed text-momo-black/75">{it?"Siamo a tua disposizione per creare l'evento più adatto alle tue esigenze: dalle feste di compleanno per bambini alle ricorrenze speciali, fino a soluzioni completamente personalizzate per famiglie, gruppi ed aziende.":"We create the event that best suits your needs: from children’s birthday parties and special occasions to fully customised solutions for families, groups and companies."}</p><p className="mt-7 font-display text-xl font-extrabold">{it?"Desideri maggiori informazioni?":"Would you like more information?"}</p><div className="mt-5 flex flex-wrap justify-center gap-3"><a href="#preventivatore" className="inline-flex items-center gap-2 rounded-full bg-momo-green-neon px-6 py-3 font-extrabold"><WandSparkles size={18}/>{it?"Crea la tua festa su misura":"Build your custom party"}</a><a href={`tel:${siteConfig.mobile.replace(/\s+/g,"")}`} className="inline-flex items-center gap-2 rounded-full bg-momo-orange px-6 py-3 font-extrabold"><Phone size={18}/>{it?"Hai un’idea in particolare? Contattaci":"Have a special idea? Contact us"}</a></div></div></Container></section>
    <section id="preventivatore" className="bg-momo-green-neon/10 py-16 sm:py-20"><Container><div className="mx-auto max-w-4xl text-center"><p className="font-display text-sm font-extrabold uppercase tracking-[.18em] text-momo-orange">{it?"Crea la tua festa su misura":"Build your custom party"}</p><h2 className="font-display mt-2 text-3xl font-extrabold sm:text-4xl">{it?"Configura e richiedi il tuo preventivo":"Configure and request your quote"}</h2></div><div className="mt-10"><BookingForm locale={locale} dict={dict} config={config} initialSlots={initialSlots}/></div></Container></section>
  </>;
}
