import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Baby, Blocks, BookOpen, Castle, CircleDot, Gamepad2, Mountain, Zap } from "lucide-react";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import OpeningHours from "@/components/OpeningHours";

const gameIcons = [Castle, Mountain, Zap, CircleDot, Blocks, BookOpen, Baby, Gamepad2];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.park.title, description: dict.park.intro };
}

export default async function ParkPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const isIt = lang === "it";

  return (
    <>
      <PageHero title={dict.park.title} logoSrc={isIt ? "/momopolis/logo-parco.png" : "/momopolis/buttons/tasto-parco-en.webp"} logoAlt={dict.park.title} />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-4xl whitespace-pre-line text-center text-lg leading-relaxed text-momo-black/75 sm:text-xl">
            {dict.park.intro}
          </div>
          <h2 className="font-display mt-16 text-center text-4xl font-extrabold text-momo-black">{dict.park.gamesTitle}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dict.park.games.map((game, index) => {
              const Icon = gameIcons[index];
              return (
                <article key={game.title} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${index % 2 ? "bg-momo-orange" : "bg-momo-green-neon"}`}><Icon size={24} /></div>
                  <h3 className="font-display mt-4 text-xl font-extrabold text-momo-black">{game.title}</h3>
                  <p className="mt-2 leading-relaxed text-momo-black/70">{game.text}</p>
                </article>
              );
            })}
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-[2rem] border border-momo-orange/30 bg-gradient-to-r from-momo-orange/10 to-momo-green-neon/15 p-6 text-center shadow-sm sm:p-8">
            <h2 className="font-display text-2xl font-extrabold text-momo-black">
              {isIt ? "Prima di entrare nell’area giochi" : "Before entering the play area"}
            </h2>
            <p className="mt-3 text-base font-bold leading-relaxed text-momo-black/75">
              {isIt
                ? "Per accedere all’area giochi, i bambini devono indossare obbligatoriamente calze antiscivolo, mentre gli adulti accompagnatori devono utilizzare gli appositi copriscarpe, disponibili gratuitamente presso il bar."
                : "To access the play area, children must wear non-slip socks, while accompanying adults must use the shoe covers available free of charge at the bar."}
            </p>
          </div>

          <div id="prezzi-orari" className="mt-16 scroll-mt-28 rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm sm:p-9">
            <p className="font-display text-sm font-extrabold uppercase tracking-[.18em] text-momo-orange">{isIt ? "Prezzi ingresso parco" : "Park admission prices"}</p>
            <div className="mt-7 grid gap-7 lg:grid-cols-2">
              <PriceTable title={isIt ? "Bambini" : "Children"} weekday={isIt ? "Settimana" : "Weekdays"} weekend={isIt ? "Weekend e festivi" : "Weekends & holidays"} rows={isIt ? [["0 – 1 anno","gratuito","gratuito"],["1 – 3 anni","CHF 8.–","CHF 10.–"],["3 – 12 anni","CHF 12.–","CHF 15.–"]] : [["0–1 year","free","free"],["1–3 years","CHF 8.–","CHF 10.–"],["3–12 years","CHF 12.–","CHF 15.–"]]} />
              <div className="space-y-7">
                <PriceTable title={isIt ? "Genitori e adulti" : "Parents & adults"} weekday={isIt ? "Settimana" : "Weekdays"} weekend={isIt ? "Weekend e festivi" : "Weekends & holidays"} rows={isIt ? [["Accompagnatori","CHF 2.–","CHF 3.–"],["Solo Family Bar","gratuito","gratuito"],["Over 65 anni","gratuito","gratuito"]] : [["Accompanying adults","CHF 2.–","CHF 3.–"],["Family Bar only","free","free"],["Over 65","free","free"]]} />
                <PriceTable title={isIt ? "Riduzioni" : "Discounts"} weekday={isIt ? "Settimana" : "Weekdays"} weekend={isIt ? "Weekend e festivi" : "Weekends & holidays"} rows={isIt ? [["Gruppi e comitive (min. 5 bambini)","−10%","−10%"],["Dal terzo figlio (stesso nucleo)","−50%","−50%"],["Disabili","gratuito","gratuito"]] : [["Groups (min. 5 children)","−10%","−10%"],["From the third child (same family)","−50%","−50%"],["Guests with disabilities","free","free"]]} />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-2xl"><OpeningHours locale={lang as Locale} /></div>
        </Container>
      </section>
    </>
  );
}

function PriceTable({title,weekday,weekend,rows}:{title:string;weekday:string;weekend:string;rows:string[][]}) {
  return <div className="overflow-hidden rounded-2xl border border-black/10"><table className="w-full text-left text-sm"><thead className="bg-momo-green-neon/25"><tr><th className="px-4 py-3 font-extrabold">{title}</th><th className="px-3 py-3 text-center font-extrabold">{weekday}</th><th className="px-3 py-3 text-center font-extrabold">{weekend}</th></tr></thead><tbody>{rows.map((row,i)=><tr key={row[0]} className={i%2?"bg-momo-cream-dim":"bg-white"}><td className="px-4 py-3 font-bold">{row[0]}</td><td className="px-3 py-3 text-center">{row[1]}</td><td className="px-3 py-3 text-center">{row[2]}</td></tr>)}</tbody></table></div>
}
