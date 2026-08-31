import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgePercent, CakeSlice, Coffee } from "lucide-react";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import Container from "@/components/Container";
import { getSiteImages } from "@/lib/site-images-store";
import { withSize } from "@/data/gallery";


function SlideIcon({size=22}:{size?:number}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21V5h7"/><path d="M7 9h5l7 11"/><path d="M12 5v4"/><path d="M3 21h18"/></svg> }
function homeImage(url:string) { return url.startsWith("/") ? url : withSize(url, 1200, 900); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const isItalian = lang === "it";
  return {
    title: isItalian
      ? "Parco giochi indoor e Family Bar a Mendrisio"
      : "Indoor playground and Family Bar in Mendrisio",
    description: isItalian
      ? "Momòpolis è il parco giochi indoor con Family Bar a Mendrisio, Ticino: giochi per bambini, feste di compleanno ed eventi vicino a Como e Varese."
      : "Momòpolis is an indoor playground and Family Bar in Mendrisio, Ticino, with children's parties and events near Como and Varese.",
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  await getDictionary(locale);
  const isIt = locale === "it";
  const siteImages = await getSiteImages();
  const cards = [
    { slug: "parco", icon: SlideIcon, image: homeImage(siteImages.homePark), overlay: "from-momo-green-neon via-momo-green-neon/20", position: "object-top" },
    { slug: "bar", icon: Coffee, image: homeImage(siteImages.homeBar), overlay: "from-momo-orange via-momo-orange/20", position: "object-center" },
    { slug: "pacchetti-feste", icon: CakeSlice, image: homeImage(siteImages.homeParties), overlay: "from-momo-orange via-momo-orange/20", position: "object-center" },
    { slug: "eventi", icon: BadgePercent, image: homeImage(siteImages.homePromotions), overlay: "from-momo-green-neon via-momo-green-neon/20", position: "object-center" },
  ];
  const labels = isIt ? ["Il parco", "Il bar", "Compleanni & eventi", "Promozioni"] : ["The park", "The bar", "Birthdays & events", "Promotions"];

  return (
    <>
    <section className="portal-home relative overflow-hidden bg-white pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(166,255,0,.22),transparent_52%)]" />

      <div className="relative px-3 pb-6 pt-4 lg:hidden">
        <Link
          href={`/${locale}/chi-siamo`}
          className="mx-auto flex h-52 w-52 flex-col items-center justify-center rounded-full border-[5px] border-momo-green-neon bg-white p-5 shadow-[0_0_0_8px_rgba(255,255,255,.9),0_18px_45px_rgba(14,166,91,.22)]"
        >
          <span className="relative h-24 w-full">
            <Image src="/momopolis/logo-header-originale.webp" alt="Momòpolis Family Bar & Park" fill sizes="180px" className="object-contain" priority />
          </span>
          <span className="font-display mt-1 rounded-full bg-momo-orange px-5 py-2 text-sm font-extrabold text-momo-black">
            {isIt ? "Chi siamo" : "About us"}
          </span>
        </Link>
        <div className="mt-5 grid grid-cols-2 gap-3">
        {cards.map(({ slug, icon: Icon, image, overlay, position }, index) => (
          <Link
            key={`mobile-${slug}`}
            href={`/${locale}/${slug}`}
            className="group relative block h-36 overflow-hidden rounded-3xl border-2 border-momo-green-neon/40 shadow-md"
          >
            <Image src={image} alt="" fill sizes="100vw" className={`object-cover ${position}`} />
            <div className={`absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t ${overlay} to-transparent`} />
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3 text-momo-black">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white shadow">
                <Icon size={17} />
              </span>
              <span className="font-display text-base font-extrabold leading-tight">{labels[index]}</span>
            </div>
          </Link>
        ))}
        </div>
      </div>

      <div className="relative mx-auto my-8 hidden h-[min(72vh,720px)] min-h-[560px] max-w-6xl grid-cols-2 grid-rows-2 gap-5 p-5 lg:grid">
        {cards.map(({ slug, icon: Icon, image, overlay, position }, index) => (
          <Link
            key={slug}
            href={`/${locale}/${slug}`}
            className="group relative overflow-hidden rounded-[1.75rem] border-2 border-momo-green-neon/40 shadow-lg"
          >
            <Image src={image} alt="" fill sizes="50vw" priority={slug === "parco"} className={`object-cover ${position} transition duration-700 group-hover:scale-105`} />
            <div className={`absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t ${overlay} to-transparent`} />
            <div className={`absolute inset-x-0 bottom-0 flex items-center gap-3 p-5 text-momo-black sm:p-8 ${slug === "bar" ? "sm:pl-32" : ""}`}>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-momo-black shadow-lg">
                <Icon size={22} />
              </span>
              <span className="font-display text-xl font-extrabold sm:text-3xl">{labels[index]}</span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href={`/${locale}/chi-siamo`}
        aria-label="Chi siamo — Momopolis"
        className="group absolute left-1/2 top-1/2 z-20 hidden h-64 w-64 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-[7px] border-momo-green-neon bg-white p-6 shadow-[0_0_0_14px_rgba(255,255,255,.94),0_24px_70px_rgba(14,166,91,.3)] transition hover:scale-105 lg:flex"
      >
        <span className="relative block h-28 w-full">
          <Image
            src="/momopolis/logo-header-originale.webp"
            alt="Momopolis"
            fill
            sizes="220px"
            className="object-contain"
            priority
          />
        </span>
        <span className="font-display mt-2 rounded-full bg-momo-orange px-6 py-2 text-base font-extrabold text-momo-black transition-colors group-hover:bg-momo-green-neon sm:text-lg">
          {isIt ? "Chi siamo" : "About us"}
        </span>
      </Link>
    </section>
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-momo-green-neon/50 bg-gradient-to-br from-white via-white to-momo-green-neon/10 p-7 shadow-sm sm:p-12">
          <h1 className="font-display text-3xl font-extrabold text-momo-black sm:text-4xl">
            {isIt ? "Momòpolis - Family Bar & Park, divertimento per tutta la famiglia." : "Momòpolis - Family Bar & Park, fun for the whole family."}
          </h1>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-momo-black/75">
            {isIt ? <>
              <p>Benvenuti a “Momòpolis”, il luogo ideale per lo svago delle famiglie in Ticino. Un Family Bar con area giochi al chiuso per bambini da 0 a 12 anni, dove divertimento, relax e sicurezza si incontrano in un ambiente accogliente aperto tutto l&apos;anno.</p>
              <p>Potrai organizzare feste di compleanno ed eventi privati, vivendo momenti speciali in totale tranquillità.</p>
              <p>Se cerchi uno spazio dove i tuoi bambini possono sfogarsi giocando, e al contempo concederti un buon caffè, un pranzo, o un aperitivo, Momòpolis è la meta ideale.</p>
            </> : <>
              <p>Welcome to Momòpolis, the ideal place for family leisure in Ticino. Our Family Bar includes an indoor play area for children aged 0 to 12, where fun, relaxation and safety meet in a welcoming setting open all year round.</p>
              <p>Organise birthday parties and private events and enjoy special moments with complete peace of mind.</p>
              <p>If you are looking for a place where children can play while you enjoy a coffee, lunch or an aperitif, Momòpolis is the perfect destination.</p>
            </>}
          </div>
        </div>
      </Container>
    </section>
    </>
  );
}
