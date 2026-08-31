import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Gem, PartyPopper, Phone, Ticket } from "lucide-react";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { getPartyConfig } from "@/lib/party-config";
import { getUpcomingAvailability } from "@/lib/availability-store";
import { isDateWithinBookingRules } from "@/lib/booking-rules";
import { siteConfig } from "@/lib/site-config";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import BookingForm from "@/components/BookingForm";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{const {lang}=await params;if(!hasLocale(lang))return{};return{title:lang==="it"?"Compleanni ed eventi":"Birthdays and events",description:lang==="it"?"Feste di compleanno ed eventi personalizzati da Momòpolis a Mendrisio.":"Birthday parties and custom events at Momòpolis in Mendrisio."};}

export default async function PartiesPage({params}:{params:Promise<{lang:string}>}) {
  const {lang}=await params;if(!hasLocale(lang))notFound();const locale=lang as Locale;const dict=await getDictionary(locale);const config=await getPartyConfig();const availability=await getUpcomingAvailability().catch(()=>[]);const initialSlots=availability.map(slot=>({...slot,remainingBookings:1,isWithinRules:isDateWithinBookingRules(slot.date,config)}));const it=locale==="it";
  const packages=it?[
    {name:"Pacchetto Classic",price:"CHF 25",features:["Ingresso parco","Food & drink base*"],note:"Per ogni adulto aggiunto: CHF 3.–"},
    {name:"Pacchetto Momòpolis",price:"CHF 32",features:["Ingresso parco","Food & drink base*","Torta","Decorazioni base*"],note:"Torte comprese, eccetto la torta personalizzata: + CHF 1.– a bambino. Per ogni adulto aggiunto: CHF 3.–",popular:true},
    {name:"Pacchetto Special",price:"CHF 42",features:["Ingresso parco","Food & drink plus*","Torta personalizzata","Decorazioni premium*"],note:"Per ogni adulto aggiunto: CHF 3.–"},
  ]:[
    {name:"Classic Package",price:"CHF 25",features:["Park admission","Basic food & drink*"],note:"Each additional adult: CHF 3.–"},
    {name:"Momòpolis Package",price:"CHF 32",features:["Park admission","Basic food & drink*","Cake","Basic decorations*"],note:"Cakes included except personalised cake: + CHF 1 per child. Each additional adult: CHF 3.",popular:true},
    {name:"Special Package",price:"CHF 42",features:["Park admission","Food & drink plus*","Personalised cake","Premium decorations*"],note:"Each additional adult: CHF 3.–"},
  ];
  return <>
    <PageHero kicker={it?"Compleanni ed eventi":"Birthdays and events"} title={it?"Trasforma la tua festa in un ricordo speciale.":"Turn your party into a special memory."} intro={it?"Da Momòpolis - Family Bar & Park ogni occasione diventa un'esperienza unica da condividere con chi ami.":"At Momòpolis - Family Bar & Park every occasion becomes a unique experience to share with those you love."}/>
    <section className="pb-6 pt-12"><Container><div className="mx-auto max-w-4xl text-center"><p className="text-lg leading-relaxed text-momo-black/75">{it?"Siamo a tua disposizione per creare l'evento più adatto alle tue esigenze: dalle feste di compleanno per bambini alle ricorrenze speciali, fino a soluzioni completamente personalizzate per famiglie, gruppi ed aziende.":"We create the event that best suits your needs: from children’s birthday parties and special occasions to fully customised solutions for families, groups and companies."}</p><p className="mt-7 font-display text-xl font-extrabold">{it?"Desideri maggiori informazioni?":"Would you like more information?"}</p><div className="mt-5 flex flex-wrap justify-center gap-3"><a href={`tel:${siteConfig.mobile.replace(/\s+/g,"")}`} className="inline-flex items-center gap-2 rounded-full bg-momo-orange px-6 py-3 font-extrabold"><Phone size={18}/>{it?"Contattaci":"Contact us"}</a><a href="#pacchetti" className="rounded-full bg-momo-green-neon px-6 py-3 font-extrabold">{it?"Scegli il pacchetto":"Choose a package"}</a><a href="#preventivatore" className="rounded-full border-2 border-momo-orange px-6 py-3 font-extrabold">{it?"Crea la tua festa su misura":"Build your custom party"}</a></div></div></Container></section>
    <section id="pacchetti" className="scroll-mt-24 overflow-hidden py-14 sm:py-20">
      <Container>
        <div className="text-center">
          <p className="font-display text-sm font-extrabold uppercase tracking-[.22em] text-momo-orange">{it?"Come vuoi festeggiare?":"How would you like to celebrate?"}</p>
          <h2 className="font-display mt-3 text-4xl font-extrabold sm:text-5xl">{it?"Tre modi di vivere Momòpolis":"Three ways to enjoy Momòpolis"}</h2>
        </div>

        <div className="mt-16 grid items-start gap-14 px-2 pb-8 pt-4 lg:grid-cols-3 lg:gap-10 lg:px-0">
          {packages.map((pkg,index)=>{
            const Icon=[Ticket,PartyPopper,Gem][index];
            const styles=[
              {shell:"-rotate-1 border-black/15 bg-[#fbfcf8]",icon:"-rotate-6 bg-momo-black text-white"},
              {shell:"border-momo-orange bg-[#fff1eb]",icon:"rotate-3 bg-momo-orange text-momo-black"},
              {shell:"rotate-1 border-momo-green-700/35 bg-[#f3fce7]",icon:"rotate-3 bg-momo-green-neon text-momo-black"},
            ][index];
            return <a href="#preventivatore" key={pkg.name} className={`group relative flex min-h-[490px] flex-col rounded-[2.75rem] border-2 p-8 pt-20 shadow-[0_18px_45px_rgba(12,13,11,.10)] transition duration-300 hover:rotate-0 hover:-translate-y-2 sm:p-9 sm:pt-20 lg:h-[500px] lg:min-h-0 ${styles.shell}`}>
              <span className={`absolute -top-8 left-8 grid h-20 w-20 place-items-center rounded-[1.5rem] shadow-lg transition group-hover:rotate-0 ${styles.icon}`}><Icon size={35}/></span>
              {pkg.popular&&<span className="absolute -top-5 right-6 -rotate-2 rounded-full bg-momo-black px-5 py-2 text-xs font-extrabold uppercase tracking-wide text-momo-green-neon shadow-md">{it?"Il preferito":"Favourite"}</span>}
              <h3 className="font-display text-3xl font-extrabold leading-tight">{pkg.name}</h3>
              <div className="mt-6 flex items-baseline gap-2 text-momo-orange"><span className="font-display text-5xl font-extrabold">{pkg.price}</span><span className="text-sm font-bold text-momo-black/45">/ {it?"bambino":"child"}</span></div>
              <p className="mt-7 text-base font-bold leading-relaxed text-momo-black/75">{pkg.features.join(" · ")}</p>
              <p className="mt-auto pt-6 text-base font-extrabold leading-relaxed text-momo-green-900">{pkg.note}</p>
            </a>
          })}
        </div>
        <div className="mt-8 rounded-2xl bg-momo-cream-dim p-6 text-sm leading-relaxed text-momo-black/70"><b>{it?"Legenda":"Legend"}:</b> {it?"* Food & drink base: acqua naturale e gasata, succo, gazosa, Coca-Cola, tè freddo e focacce lisce e farcite. * Food & drink plus: pacchetto base più panini farciti, salatini, olive, salumi e formaggi. * Decorazioni base: bicchieri, piattini, tovaglioli e palloncini Momòpolis o a tema. * Decorazioni premium: più dettagli personalizzati e strutture elaborate di palloncini.":"* Basic food & drink: water, juice, soft drinks, iced tea and focaccia. * Plus adds sandwiches, savoury snacks, olives, cold cuts and cheeses. * Basic decorations include Momòpolis or themed tableware and balloons; * premium decorations add personalised details and elaborate balloon structures."}</div>
      </Container>
    </section>
    <section id="preventivatore" className="bg-momo-green-neon/10 py-16 sm:py-20"><Container><div className="mx-auto max-w-4xl text-center"><p className="font-display text-sm font-extrabold uppercase tracking-[.18em] text-momo-orange">{it?"Crea la tua festa su misura":"Build your custom party"}</p><h2 className="font-display mt-2 text-3xl font-extrabold sm:text-4xl">{it?"Configura e richiedi il tuo preventivo":"Configure and request your quote"}</h2></div><div className="mt-10"><BookingForm locale={locale} dict={dict} config={config} initialSlots={initialSlots}/></div></Container></section>
  </>;
}
