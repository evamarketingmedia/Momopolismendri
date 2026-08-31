import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgePercent, Gift, Sparkles } from "lucide-react";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";

export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{const {lang}=await params;return hasLocale(lang)?{title:lang==="it"?"Promozioni":"Promotions",description:lang==="it"?"Offerte e sconti Momòpolis a Mendrisio.":"Momòpolis offers and discounts in Mendrisio."}:{};}

export default async function PromotionsPage({params}:{params:Promise<{lang:string}>}) {
  const {lang}=await params;if(!hasLocale(lang))notFound();const locale=lang as Locale;await getDictionary(locale);const it=locale==="it";
  const sections=it?[
    {title:"Sconti speciali",icon:BadgePercent,items:["Se sei cliente FoxTown e hai fatto acquisti presso uno dei suoi negozi, lo stesso giorno presenta all’ingresso del parco la ricevuta: avrai uno sconto del 20% sull’ingresso.","Hai pranzato presso Old Wild West con la tua famiglia? I nostri partner ti lasceranno un buono sconto pari al 20% sull’ingresso al parco, valido per tutti i partecipanti."]},
    {title:"Esclusivo",icon:Gift,items:["Iscriviti alla nostra newsletter con programma fedeltà: riceverai una tessera personale con omaggi dedicati. Più vieni a farci visita, più sarai premiato!","Sei un cliente FoxPrivilege? Per te uno sconto fisso del 10% sull’ingresso al Parco."]},
    {title:"Promozioni",icon:Sparkles,items:["Il giorno del tuo compleanno l’ingresso è gratuito.","Prezzi agevolati per comitive, scolaresche ed associazioni (10% grandi famiglie, 50% dal 3° figlio)."]},
  ]:[
    {title:"Special discounts",icon:BadgePercent,items:["FoxTown customers who show a same-day receipt at the park entrance receive 20% off admission.","After a family meal at Old Wild West, use the 20% admission voucher offered by our partners for every participant."]},
    {title:"Exclusive",icon:Gift,items:["Join our loyalty newsletter to receive a personal card and dedicated gifts. The more you visit, the more you are rewarded!","FoxPrivilege customers receive a permanent 10% discount on park admission."]},
    {title:"Promotions",icon:Sparkles,items:["Admission is free on your birthday.","Special rates for groups, schools and associations."]},
  ];
  return <><PageHero kicker={it?"Offerte Momòpolis":"Momòpolis offers"} title={it?"Promozioni":"Promotions"} intro={it?"Approfitta delle nostre offerte e scopri soluzioni sempre nuove per venire a trovarci a prezzi vantaggiosi!":"Take advantage of our offers and discover new ways to visit us at great prices!"} titleClassName="font-logo-title text-momo-orange"/><section className="py-16 sm:py-20"><Container className="grid gap-6 lg:grid-cols-3">{sections.map(({title,icon:Icon,items},i)=><article key={title} className={`rounded-[2rem] border p-7 shadow-sm ${i===1?"border-momo-orange/40 bg-momo-orange/10":"border-momo-green-neon/50 bg-white"}`}><span className={`grid h-12 w-12 place-items-center rounded-2xl ${i===1?"bg-momo-orange":"bg-momo-green-neon"}`}><Icon size={23}/></span><h2 className="font-display mt-5 text-2xl font-extrabold">{title}</h2><ul className="mt-5 space-y-4 text-momo-black/75">{items.map(item=><li key={item} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-momo-orange"/><span>{item}</span></li>)}</ul></article>)}</Container></section></>;
}
