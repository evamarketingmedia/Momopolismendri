import { siteConfig } from "@/lib/site-config";
import type { Locale } from "@/lib/dictionaries";

export default function StructuredData({ locale }: { locale: Locale }) {
  const data = {
    "@context": "https://schema.org",
    "@type": ["AmusementPark", "CafeOrCoffeeShop", "Restaurant", "LocalBusiness"],
    name: siteConfig.name,
    alternateName: `${siteConfig.name} ${siteConfig.tagline}`,
    description:
      locale === "it"
        ? "Parco giochi al coperto, bar e organizzazione feste per bambini a Mendrisio, a due passi da FoxTown."
        : "Indoor playground, bar and children's party venue in Mendrisio, just steps from FoxTown, Switzerland.",
    url: siteConfig.domain,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: "CHF",
    slogan: locale === "it" ? "Divertimento per tutta la famiglia in Ticino" : "Fun for the whole family in Ticino",
    keywords: "Family Bar, parco giochi indoor, famiglie Ticino, famiglie Mendrisiotto, feste di compleanno, eventi privati, bambini 0-12 anni",
    image: `${siteConfig.domain}/momopolis/ingresso.webp`,
    hasMap: siteConfig.mapsDirectionsUrl,
    currenciesAccepted: "CHF",
    paymentAccepted: "Cash, Credit Card",
    knowsLanguage: ["it", "en"],
    areaServed: [
      { "@type": "AdministrativeArea", name: "Ticino, Svizzera" },
      { "@type": "AdministrativeArea", name: "Lombardia, Italia" },
      { "@type": "City", name: "Mendrisio" },
      { "@type": "City", name: "Como" },
      { "@type": "City", name: "Varese" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.canton,
      postalCode: siteConfig.address.zip,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday"],
        opens: "10:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "10:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:30",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:30",
        closes: "18:00",
      },
    ],
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: locale === "it" ? "Parcheggi gratuiti" : "Free parking",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: locale === "it" ? "Area giochi al coperto" : "Indoor play area",
        value: true,
      },
    ],
    sameAs: [siteConfig.social.instagram, siteConfig.social.facebook].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
