import "server-only";
import { isSupabaseConfigured, supabase } from "./supabase";

export type PartyChoice = {
  id: string;
  label: string;
  description: string;
  price: number;
};

export type PartyConfig = {
  baseWeekdayPrice: number;
  baseHolidayPrice: number;
  holidayDates: string[];
  baseChildPrice: number;
  adultPrice: number;
  minimumChildren: number;
  minimumAdvanceDays: number;
  bookingStartDate: string;
  bookingEndDate: string;
  morningWeekdayPrice: number;
  morningHolidayPrice: number;
  afternoonWeekdayPrice: number;
  afternoonHolidayPrice: number;
  fullDayWeekdayPrice: number;
  fullDayHolidayPrice: number;
  weekdayMaxBookings: number;
  weekendMaxBookings: number;
  closedWeekdays: number[];
  packages: PartyChoice[];
  cakes: PartyChoice[];
  extras: PartyChoice[];
  setups: PartyChoice[];
};

export const defaultPartyConfig: PartyConfig = {
  baseWeekdayPrice: 100,
  baseHolidayPrice: 120,
  holidayDates: [],
  baseChildPrice: 0,
  adultPrice: 3,
  minimumChildren: 0,
  minimumAdvanceDays: 5,
  bookingStartDate: "2026-10-01",
  bookingEndDate: "2099-12-31",
  morningWeekdayPrice: 80,
  morningHolidayPrice: 100,
  afternoonWeekdayPrice: 100,
  afternoonHolidayPrice: 120,
  fullDayWeekdayPrice: 160,
  fullDayHolidayPrice: 200,
  weekdayMaxBookings: 3,
  weekendMaxBookings: 4,
  closedWeekdays: [1],
  packages: [
    { id: "classic", label: "Pacchetto Classic", description: "Ingresso parco e Food & drink base*", price: 25 },
    { id: "super", label: "Pacchetto Momòpolis", description: "Ingresso parco, Food & drink base*, torta e decorazioni base*", price: 32 },
    { id: "wow", label: "Pacchetto Special", description: "Ingresso parco, Food & drink plus*, torta personalizzata e decorazioni premium*", price: 42 },
  ],
  cakes: [
    { id: "nutella", label: "Panini alla Nutella a forma di numero", description: "CHF 3.50 per bambino", price: 3.5 },
    { id: "fruit", label: "Crostata o sfoglia di frutta", description: "CHF 5 per bambino", price: 5 },
    { id: "classic-cake", label: "Torta classica", description: "Foresta nera, Saint-Honoré, meringata, pandispagna…", price: 5 },
    { id: "personalised-cake", label: "Torta personalizzata", description: "Con foto, immagini o scritte speciali", price: 6 },
    { id: "own-cake", label: "Porto la mia torta", description: "CHF 1 per bambino", price: 1 },
  ],
  extras: [
    { id: "prosecco", label: "Bottiglia di prosecco", description: "Una bottiglia", price: 32 },
    { id: "spritz", label: "Caraffa Spritz", description: "1 litro", price: 36 },
    { id: "spirits", label: "Bottiglia super alcolico", description: "Una bottiglia", price: 69 },
    { id: "aperitif", label: "Tagliere aperitivo", description: "Circa 4 persone", price: 12 },
  ],
  setups: [
    { id: "base", label: "BASE", description: "Bicchieri, piatti, tovaglioli e palloncini a tema ed eventuale sfondo a parete", price: 50 },
    { id: "super-setup", label: "SUPER", description: "Pacchetto base, maggiori dettagli personalizzati e strutture elaborate di palloncini (arco o colonne)", price: 150 },
  ],
};

export async function getPartyConfig(): Promise<PartyConfig> {
  if (!isSupabaseConfigured) return defaultPartyConfig;
  const { data, error } = await supabase!
    .from("site_images")
    .select("url")
    .eq("key", "party_config")
    .abortSignal(AbortSignal.timeout(5000))
    .maybeSingle();
  if (error || !data?.url) return defaultPartyConfig;
  try {
    const stored = JSON.parse(data.url as string) as Partial<PartyConfig>;
    return {
      ...defaultPartyConfig,
      ...stored,
      bookingStartDate: stored.bookingStartDate || "2026-10-01",
      bookingEndDate: !stored.bookingStartDate && stored.bookingEndDate === "2026-10-01" ? "2099-12-31" : (stored.bookingEndDate ?? "2099-12-31"),
      cakes: defaultPartyConfig.cakes,
      extras: defaultPartyConfig.extras,
      setups: defaultPartyConfig.setups,
    };
  } catch {
    console.error("[party-config] invalid stored JSON, using defaults");
    return defaultPartyConfig;
  }
}
