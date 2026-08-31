"use client";

import { DayPicker } from "react-day-picker";
import { it, enUS } from "date-fns/locale";
import "react-day-picker/style.css";
import type { Locale, Dictionary } from "@/lib/dictionaries";

export type PublicAvailabilitySlot = {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  capacity: number;
  remaining: number;
  isAvailable: boolean;
  remainingBookings: number;
  isWithinRules: boolean;
};

function toDateOnly(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isOpenSlot(slot: PublicAvailabilitySlot) {
  return slot.isAvailable && slot.remaining > 0 && (slot.remainingBookings ?? 1) > 0 && slot.isWithinRules !== false;
}

export default function AvailabilityCalendar({ locale, dict, slots, selected, onSelect, loading }: {
  locale: Locale;
  dict: Dictionary;
  slots: PublicAvailabilitySlot[];
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  loading: boolean;
}) {
  const today = toDateOnly(new Date());
  const openDates = Array.from(new Set(slots.filter(isOpenSlot).map((s) => s.date))).map(parseDate);
  const soldOutDates = Array.from(new Set(slots.filter((s) => !isOpenSlot(s)).map((s) => s.date).filter((date) => !slots.some((s) => s.date === date && isOpenSlot(s))))).map(parseDate);
  const openDateKeys = new Set(openDates.map((d) => d.toDateString()));

  return (
    <div className="w-full rounded-3xl border border-black/10 bg-white p-4 sm:p-6">
      <h3 className="font-display text-lg font-extrabold text-momo-black">{dict.contact.calendarTitle}</h3>
      {loading && <p className="mt-6 text-sm text-momo-black/60">{dict.contact.calendarLoading}</p>}
      {!loading && openDates.length === 0 && <p className="mt-6 text-sm text-momo-black/60">{dict.contact.calendarNoDates}</p>}
      <div className={`momo-calendar mt-4 transition-opacity ${loading ? "opacity-55" : "opacity-100"}`}>
        <DayPicker
          mode="single"
          defaultMonth={openDates[0] ?? new Date(2026, 9, 1)}
          locale={locale === "it" ? it : enUS}
          selected={selected}
          onSelect={onSelect}
          disabled={[{ before: today }, (date) => !openDateKeys.has(date.toDateString())]}
          modifiers={{ available: openDates, soldOut: soldOutDates }}
          modifiersClassNames={{ available: "rdp-day_available", soldOut: "rdp-day_booked" }}
          className="mx-auto"
        />
      </div>
      <label className="mt-4 block sm:hidden">
        <span className="mb-1.5 block text-sm font-extrabold">
          {locale === "it" ? "Seleziona una data disponibile" : "Select an available date"}
        </span>
        <select
          className="momo-input"
          value={selected ? `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, "0")}-${String(selected.getDate()).padStart(2, "0")}` : ""}
          onChange={(event) => onSelect(event.target.value ? parseDate(event.target.value) : undefined)}
          disabled={loading || openDates.length === 0}
        >
          <option value="">{locale === "it" ? "Scegli la data" : "Choose a date"}</option>
          {openDates.map((date) => {
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
            return <option key={value} value={value}>{date.toLocaleDateString(locale === "it" ? "it-CH" : "en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</option>;
          })}
        </select>
      </label>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-momo-black/70">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-momo-green-500"/>{dict.contact.calendarLegendAvailable}</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-black/25"/>{dict.contact.calendarLegendBooked}</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-momo-orange"/>{dict.contact.calendarLegendSelected}</span>
      </div>
    </div>
  );
}
