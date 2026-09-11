"use server";

import { redirect } from "next/navigation";
import {
  authenticateAdmin,
  createAdminSession,
  clearAdminSession,
  requireOwner,
} from "@/lib/admin-auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { revalidatePublicSite } from "@/lib/revalidate-site";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const clientPortal = formData.get("portal") === "client";

  const admin = await authenticateAdmin(username, password);
  if (!admin) {
    redirect(clientPortal ? "/admin/client/login?error=1" : "/admin/login?error=1");
  }

  await createAdminSession(admin.userId);
  redirect(admin.role === "client" ? "/admin/client" : "/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function updateSiteImage(formData: FormData) {
  await requireOwner();
  if (!isSupabaseConfigured) throw new Error("Supabase not configured");

  const key = String(formData.get("key") ?? "");
  let url = String(formData.get("url") ?? "").trim();
  const file = formData.get("file");
  if (!key) throw new Error("Missing key");

  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) throw new Error("Il file deve essere un’immagine");
    if (file.size > 8 * 1024 * 1024) throw new Error("Immagine troppo grande: massimo 8 MB");
    const bucket = "site-images";
    const { data: buckets } = await supabase!.storage.listBuckets();
    if (!buckets?.some((item) => item.name === bucket)) {
      const { error: bucketError } = await supabase!.storage.createBucket(bucket, { public: true });
      if (bucketError) throw bucketError;
    }
    const extension = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "webp";
    const path = `${key}-${Date.now()}.${extension}`;
    const { error: uploadError } = await supabase!.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;
    url = supabase!.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
  if (!url) throw new Error("Scegli un’immagine o inserisci un URL");

  const { error } = await supabase!
    .from("site_images")
    .upsert({ key, url, updated_at: new Date().toISOString() });

  if (error) throw error;

  revalidatePublicSite();
  redirect("/admin?saved=1");
}

export async function addGalleryImage(formData: FormData) {
  await requireOwner();
  if (!isSupabaseConfigured) throw new Error("Supabase not configured");

  const category = String(formData.get("category") ?? "");
  const url = String(formData.get("url") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0);

  if (!["playground", "parties", "events"].includes(category) || !url) {
    throw new Error("Invalid category or url");
  }

  const { error } = await supabase!
    .from("gallery_images")
    .insert({ category, url, sort_order: Number.isFinite(sortOrder) ? sortOrder : 0 });

  if (error) throw error;

  revalidatePublicSite();
  redirect("/admin?saved=1");
}

export async function updateGalleryImage(formData: FormData) {
  await requireOwner();
  if (!isSupabaseConfigured) throw new Error("Supabase not configured");

  const id = String(formData.get("id") ?? "");
  const url = String(formData.get("url") ?? "").trim();
  if (!id || !url) throw new Error("Missing id or url");

  const { error } = await supabase!.from("gallery_images").update({ url }).eq("id", id);
  if (error) throw error;

  revalidatePublicSite();
  redirect("/admin?saved=1");
}

export async function deleteGalleryImage(formData: FormData) {
  await requireOwner();
  if (!isSupabaseConfigured) throw new Error("Supabase not configured");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing id");

  const { error } = await supabase!.from("gallery_images").delete().eq("id", id);
  if (error) throw error;

  revalidatePublicSite();
  redirect("/admin?saved=1");
}

export async function updatePartyConfig(formData: FormData) {
  await requireOwner();
  if (!isSupabaseConfigured) throw new Error("Supabase not configured");

  const parseChoices = (name: string) => {
    const value = JSON.parse(String(formData.get(name) ?? "[]"));
    if (!Array.isArray(value)) throw new Error(`${name} non valido`);
    return value.map((item) => ({
      id: String(item.id ?? "").trim(),
      label: String(item.label ?? "").trim(),
      description: String(item.description ?? "").trim(),
      price: Number(item.price ?? 0),
    })).filter((item) => item.id && item.label && Number.isFinite(item.price));
  };

  const value = {
    baseWeekdayPrice: Number(formData.get("baseWeekdayPrice")),
    baseHolidayPrice: Number(formData.get("baseHolidayPrice")),
    holidayDates: String(formData.get("holidayDates") ?? "")
      .split(/\s|,/)
      .map((date) => date.trim())
      .filter(Boolean),
    baseChildPrice: Number(formData.get("baseChildPrice")),
    adultPrice: Number(formData.get("adultPrice")),
    minimumChildren: Number(formData.get("minimumChildren")),
    minimumAdvanceDays: Number(formData.get("minimumAdvanceDays")),
    bookingStartDate: String(formData.get("bookingStartDate") ?? "2026-10-15"),
    bookingEndDate: String(formData.get("bookingEndDate") ?? ""),
    morningWeekdayPrice: Number(formData.get("morningWeekdayPrice")),
    morningHolidayPrice: Number(formData.get("morningHolidayPrice")),
    afternoonWeekdayPrice: Number(formData.get("afternoonWeekdayPrice")),
    afternoonHolidayPrice: Number(formData.get("afternoonHolidayPrice")),
    fullDayWeekdayPrice: Number(formData.get("fullDayWeekdayPrice")),
    fullDayHolidayPrice: Number(formData.get("fullDayHolidayPrice")),
    weekdayMaxBookings: Number(formData.get("weekdayMaxBookings")),
    weekendMaxBookings: Number(formData.get("weekendMaxBookings")),
    closedWeekdays: String(formData.get("closedWeekdays") ?? "1").split(",").map(Number).filter(Number.isFinite),
    packages: parseChoices("packages"),
    cakes: parseChoices("cakes"),
    extras: parseChoices("extras"),
    setups: parseChoices("setups"),
  };
  value.holidayDates = value.holidayDates.map((date) => {
    const match = date.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    return match ? `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}` : date;
  });

  if (![value.baseWeekdayPrice, value.baseHolidayPrice, value.baseChildPrice, value.adultPrice, value.minimumChildren, value.minimumAdvanceDays, value.morningWeekdayPrice, value.morningHolidayPrice, value.afternoonWeekdayPrice, value.afternoonHolidayPrice, value.fullDayWeekdayPrice, value.fullDayHolidayPrice, value.weekdayMaxBookings, value.weekendMaxBookings].every(Number.isFinite)) {
    throw new Error("Prezzi base non validi");
  }

  const { error } = await supabase!.from("site_images").upsert({
    key: "party_config",
    url: JSON.stringify(value),
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;

  revalidatePublicSite();
  redirect("/admin?saved=party");
}
