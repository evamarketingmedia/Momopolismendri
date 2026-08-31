export const siteConfig = {
  name: "Momòpolis",
  tagline: "Family Bar & Park",
  domain: "https://www.momopolis.ch",
  email: "info@momopolis.ch",
  phone: "+41 91 226 63 76",
  mobile: "+41 76 621 63 76",
  whatsapp: "41766216376",
  address: {
    street: "Via Penate 7",
    zip: "6850",
    city: "Mendrisio",
    canton: "Ticino",
    country: "CH",
  },
  geo: {
    lat: 45.8617,
    lng: 8.9779,
  },
  // No API key required — swap the query for the exact address once known.
  mapsEmbedSrc:
    "https://www.google.com/maps?q=Via+Penate+7,+6850+Mendrisio,+Svizzera&output=embed",
  mapsDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Via+Penate+7,+6850+Mendrisio,+Svizzera",
  openingHours: [
    { day: { it: "Lunedì", en: "Monday" }, hours: "Chiuso / Closed" },
    { day: { it: "Martedì, mercoledì, giovedì", en: "Tuesday, Wednesday, Thursday" }, hours: "10:00 – 19:00" },
    { day: { it: "Venerdì", en: "Friday" }, hours: "10:00 – 20:00" },
    { day: { it: "Sabato", en: "Saturday" }, hours: "10:30 – 20:00" },
    { day: { it: "Domenica", en: "Sunday" }, hours: "10:30 – 18:00" },
  ],
  social: {
    instagram: "",
    facebook: "",
  },
} as const;
