import { Clock } from "lucide-react";
import type { Locale } from "@/lib/dictionaries";
import { siteConfig } from "@/lib/site-config";

export default function OpeningHours({locale}:{locale:Locale}) {
  return <div className="rounded-[2rem] border border-momo-orange/25 bg-white p-6 shadow-sm sm:p-8">
    <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-momo-green-neon"><Clock size={21}/></span><h2 className="font-display text-2xl font-extrabold">{locale==="it"?"Orari di apertura":"Opening hours"}</h2></div>
    <div className="mt-5 divide-y divide-black/10">{siteConfig.openingHours.map(row=><div key={row.day.it} className="flex items-center justify-between gap-5 py-3 text-sm sm:text-base"><span className="font-extrabold">{row.day[locale]}</span><span className="font-bold text-momo-black/65">{row.hours}</span></div>)}</div>
  </div>;
}
