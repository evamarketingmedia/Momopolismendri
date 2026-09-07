import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import Container from "@/components/Container";

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
  const cards = [
    { slug: "parco", image: "/momopolis/buttons/tasto-parco.png", alt: isIt ? "Il parco" : "The park" },
    { slug: "bar", image: "/momopolis/buttons/tasto-bar.png", alt: isIt ? "Il bar" : "The bar" },
    { slug: "pacchetti-feste", image: "/momopolis/buttons/tasto-feste.png", alt: isIt ? "Feste ed eventi" : "Parties and events" },
    { slug: "eventi", image: "/momopolis/buttons/tasto-promo.png", alt: isIt ? "Promozioni" : "Promotions" },
  ];

  return (
    <>
    <section className="portal-home relative overflow-hidden bg-white pt-28 sm:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(166,255,0,.22),transparent_52%)]" />

      <div className="relative mx-auto max-w-4xl px-5 pb-2 pt-4 sm:px-8 lg:pt-6">
        <div className="relative aspect-[2.62/1] w-full">
          <Image
            src="/momopolis/payoff.png"
            alt={isIt ? "Divertimento per tutta la famiglia" : "Fun for the whole family"}
            fill
            sizes="(max-width: 1024px) 94vw, 850px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="relative px-4 pb-8 pt-2 lg:hidden">
        <Link
          href={`/${locale}/chi-siamo`}
          className="relative z-20 mx-auto flex h-60 w-60 flex-col items-center justify-center rounded-full border-[6px] border-momo-green-neon bg-white p-5 shadow-[0_0_0_8px_rgba(255,255,255,.9),0_18px_45px_rgba(14,166,91,.22)]"
        >
          <span className="relative h-24 w-full">
            <Image src="/momopolis/logo-header-originale.webp" alt="Momòpolis Family Bar & Park" fill sizes="180px" className="object-contain" priority />
          </span>
          <span className="font-display mt-1 rounded-full bg-momo-orange px-5 py-2 text-sm font-extrabold text-momo-black">
            {isIt ? "Chi siamo" : "About us"}
          </span>
        </Link>
        <div className="mx-auto -mt-4 grid max-w-xl gap-3">
        {cards.map(({ slug, image, alt }) => (
          <Link
            key={`mobile-${slug}`}
            href={`/${locale}/${slug}`}
            aria-label={alt}
            className="group relative block aspect-[2/1] overflow-hidden rounded-3xl bg-white shadow-md"
          >
            <Image src={image} alt={alt} fill sizes="calc(100vw - 2rem)" className="object-contain transition duration-500 group-hover:scale-[1.02]" />
          </Link>
        ))}
        </div>
      </div>

      <div className="relative mx-auto mb-10 mt-2 hidden h-[min(68vh,680px)] min-h-[540px] max-w-6xl grid-cols-2 grid-rows-2 gap-5 p-5 lg:grid">
        {cards.map(({ slug, image, alt }) => (
          <Link
            key={slug}
            href={`/${locale}/${slug}`}
            aria-label={alt}
            className="group relative overflow-hidden rounded-[1.75rem] bg-white shadow-lg"
          >
            <Image src={image} alt={alt} fill sizes="50vw" priority={slug === "parco"} className="object-contain transition duration-500 group-hover:scale-[1.025]" />
          </Link>
        ))}

        <Link
          href={`/${locale}/chi-siamo`}
          aria-label="Chi siamo — Momopolis"
          className="group absolute left-1/2 top-1/2 z-20 flex h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-[8px] border-momo-green-neon bg-white p-8 shadow-[0_0_0_14px_rgba(255,255,255,.94),0_24px_70px_rgba(14,166,91,.3)] transition hover:scale-105"
        >
          <span className="relative block h-36 w-full">
            <Image src="/momopolis/logo-header-originale.webp" alt="Momopolis" fill sizes="220px" className="object-contain" priority />
          </span>
          <span className="font-display mt-2 rounded-full bg-momo-orange px-6 py-2 text-base font-extrabold text-momo-black transition-colors group-hover:bg-momo-green-neon sm:text-lg">
            {isIt ? "Chi siamo" : "About us"}
          </span>
        </Link>
      </div>
    </section>
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-momo-green-neon/50 bg-gradient-to-br from-white via-white to-momo-green-neon/10 p-7 shadow-sm sm:p-12">
          <h1 className="font-display text-3xl font-extrabold text-momo-black sm:text-4xl">
            {isIt ? "Momòpolis - Family Bar & Park" : "Momòpolis - Family Bar & Park"}
          </h1>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-momo-black/75">
            {isIt ? <>
              <p>Benvenuti a “Momòpolis”, il luogo ideale per lo svago delle famiglie in Ticino. Un Family Bar con area giochi al chiuso per bambini da 0 a 12 anni, dove divertimento, relax e sicurezza si incontrano in un ambiente accogliente aperto tutto l&apos;anno.</p>
              <p>Potrai organizzare feste di compleanno ed eventi privati, vivendo momenti speciali in totale tranquillità.</p>
              <p>Se cerchi uno spazio dove i tuoi bambini possono giocare, e al contempo concederti un buon caffè, un pranzo, o un aperitivo, Momòpolis è la meta ideale.</p>
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
