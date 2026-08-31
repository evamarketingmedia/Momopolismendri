import type { PartyConfig } from "./party-config";

export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}

export function earliestBookableDate(config: PartyConfig, now = new Date()) {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  date.setDate(date.getDate() + config.minimumAdvanceDays);
  return date;
}

export function isHolidayOrWeekend(date: string, config: PartyConfig) {
  const day = new Date(`${date}T12:00:00`).getDay();
  return day === 0 || day === 6 || config.holidayDates.includes(date);
}

export function dailyBookingLimit(date: string, config: PartyConfig) {
  return isHolidayOrWeekend(date, config) ? config.weekendMaxBookings : config.weekdayMaxBookings;
}

export function isDateWithinBookingRules(date: string, config: PartyConfig, now = new Date()) {
  const value = new Date(`${date}T12:00:00`);
  if (Number.isNaN(value.getTime()) || config.closedWeekdays.includes(value.getDay())) return false;
  if (date < dateKey(earliestBookableDate(config, now))) return false;
  if (config.bookingStartDate && date < config.bookingStartDate) return false;
  return !config.bookingEndDate || date <= config.bookingEndDate;
}
