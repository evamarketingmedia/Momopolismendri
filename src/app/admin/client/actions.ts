"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getPartyConfig } from "@/lib/party-config";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { revalidatePublicSite } from "@/lib/revalidate-site";

export async function updateClientPartyConfig(formData: FormData) {
  await requireAdmin();
  if (!isSupabaseConfigured) throw new Error("Supabase non configurato");
  const current = await getPartyConfig();
  const number = (name:string, fallback:number) => {
    const value = Number(formData.get(name));
    return Number.isFinite(value) ? value : fallback;
  };
  const choices = (name:string, fallback:typeof current.packages) => {
    try {
      const parsed = JSON.parse(String(formData.get(name) ?? "[]"));
      if (!Array.isArray(parsed)) return fallback;
      return parsed.map(item=>({id:String(item.id??"").trim(),label:String(item.label??"").trim(),description:String(item.description??"").trim(),price:Number(item.price??0)})).filter(item=>item.id&&item.label&&Number.isFinite(item.price));
    } catch { return fallback; }
  };
  const dates = String(formData.get("holidayDates") ?? "").split(/[\s,]+/).map(value=>value.trim()).filter(Boolean).map(value=>{const match=value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);return match?`${match[3]}-${match[2].padStart(2,"0")}-${match[1].padStart(2,"0")}`:value;});
  const value = {
    ...current,
    minimumAdvanceDays: number("minimumAdvanceDays", current.minimumAdvanceDays),
    bookingStartDate: String(formData.get("bookingStartDate") || current.bookingStartDate),
    bookingEndDate: String(formData.get("bookingEndDate") ?? current.bookingEndDate),
    weekdayMaxBookings: number("weekdayMaxBookings", current.weekdayMaxBookings),
    weekendMaxBookings: number("weekendMaxBookings", current.weekendMaxBookings),
    closedWeekdays: String(formData.get("closedWeekdays") ?? current.closedWeekdays.join(",")).split(",").map(Number).filter(Number.isFinite),
    holidayDates: dates,
    morningWeekdayPrice: number("morningWeekdayPrice", current.morningWeekdayPrice),
    morningHolidayPrice: number("morningHolidayPrice", current.morningHolidayPrice),
    afternoonWeekdayPrice: number("afternoonWeekdayPrice", current.afternoonWeekdayPrice),
    afternoonHolidayPrice: number("afternoonHolidayPrice", current.afternoonHolidayPrice),
    fullDayWeekdayPrice: number("fullDayWeekdayPrice", current.fullDayWeekdayPrice),
    fullDayHolidayPrice: number("fullDayHolidayPrice", current.fullDayHolidayPrice),
    adultPrice: number("adultPrice", current.adultPrice),
    packages: choices("packages", current.packages),
    cakes: choices("cakes", current.cakes),
    extras: choices("extras", current.extras),
    setups: choices("setups", current.setups),
  };
  const { error } = await supabase!.from("site_images").upsert({key:"party_config",url:JSON.stringify(value),updated_at:new Date().toISOString()});
  if (error) throw error;
  revalidatePublicSite();
  redirect("/admin/client?saved=1#orari");
}
