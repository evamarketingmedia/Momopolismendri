import "server-only";
import { supabase, isSupabaseConfigured } from "./supabase";
import { featureImages, bareUnsplashUrl } from "@/data/gallery";

export type SiteImageKey = keyof typeof featureImages;

const FALLBACK: Record<SiteImageKey, string> = Object.fromEntries(
  Object.entries(featureImages).map(([key, photoId]) => [key, bareUnsplashUrl(photoId)])
) as Record<SiteImageKey, string>;

FALLBACK.homePark = "https://images.pexels.com/photos/19875331/pexels-photo-19875331.jpeg";
FALLBACK.homeBar = "/momopolis/home-bar.png";
FALLBACK.homeParties = "/momopolis/home-compleanni.png";
FALLBACK.homePromotions = "/momopolis/home-promozioni.png";

// snake_case keys in the DB (site_images.key) map to the camelCase keys used
// in application code (featureImages).
const KEY_MAP: Record<string, SiteImageKey> = {
  home_park: "homePark",
  home_bar: "homeBar",
  home_parties: "homeParties",
  home_promotions: "homePromotions",
  homePark: "homePark",
  homeBar: "homeBar",
  homeParties: "homeParties",
  homePromotions: "homePromotions",
  hero_slide: "heroSlide",
  hero_jump: "heroJump",
  about_story: "aboutStory",
  about_team: "aboutTeam",
  zones_a: "zonesA",
  zones_b: "zonesB",
  zones_c: "zonesC",
  event_birthday: "eventBirthday",
  event_class: "eventClass",
  event_corporate: "eventCorporate",
  event_themed: "eventThemed",
};

for (const key of Object.keys(featureImages) as SiteImageKey[]) KEY_MAP[key] = key;

export async function getSiteImages(): Promise<Record<SiteImageKey, string>> {
  if (!isSupabaseConfigured) {
    return FALLBACK;
  }

  let data: { key: string; url: string }[] | null = null;
  let error: unknown = null;
  try {
    const timeout = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error("Supabase image request timed out") }), 1500)
    );
    const query = supabase!.from("site_images").select("key, url");
    const result = await Promise.race([query, timeout]);
    data = result.data;
    error = result.error;
  } catch (requestError) {
    error = requestError;
  }

  if (error) {
    console.error("[site-images] failed to fetch from Supabase, using fallback", error);
    return FALLBACK;
  }

  const result = { ...FALLBACK };
  for (const row of data ?? []) {
    const appKey = KEY_MAP[row.key as string];
    if (!appKey) continue;
    const isNewHomeImage = ["homePark", "homeBar", "homeParties", "homePromotions"].includes(appKey);
    const legacyHomeUrls = new Set([
      "/momopolis/bar.webp",
      "/momopolis/ingresso.webp",
      "https://images.pexels.com/photos/19875331/pexels-photo-19875331.jpeg",
      bareUnsplashUrl(featureImages.homePark),
      bareUnsplashUrl(featureImages.homeBar),
      bareUnsplashUrl(featureImages.homeParties),
      bareUnsplashUrl(featureImages.homePromotions),
    ]);
    // The three supplied images replace the previous stock defaults. A later
    // upload from the admin (stored in Supabase Storage) still takes priority.
    if (isNewHomeImage && legacyHomeUrls.has(row.url)) continue;
    result[appKey] = row.url as string;
  }
  return result;
}
