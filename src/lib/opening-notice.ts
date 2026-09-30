import "server-only";
import { isSupabaseConfigured, supabase } from "./supabase";

export type OpeningNoticeConfig = { textIt: string; textEn: string; backgroundColor: string };

export const defaultOpeningNotice: OpeningNoticeConfig = {
  textIt: "✨ Sta arrivando Momòpolis! Apertura ottobre 2026",
  textEn: "✨ Momòpolis is coming! Opening October 2026",
  backgroundColor: "#000000",
};

export async function getOpeningNoticeConfig(): Promise<OpeningNoticeConfig> {
  if (!isSupabaseConfigured || !supabase) return defaultOpeningNotice;
  const { data, error } = await supabase.from("site_images").select("url").eq("key", "opening_notice_config").maybeSingle();
  if (error || !data?.url) return defaultOpeningNotice;
  try {
    const value = JSON.parse(data.url) as Partial<OpeningNoticeConfig>;
    return { ...defaultOpeningNotice, ...value };
  } catch {
    return defaultOpeningNotice;
  }
}
