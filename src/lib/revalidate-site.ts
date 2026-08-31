import "server-only";
import { revalidatePath } from "next/cache";

const PUBLIC_PATHS = [
  "/it",
  "/en",
  "/it/chi-siamo",
  "/en/chi-siamo",
  "/it/parco",
  "/en/parco",
  "/it/bar",
  "/en/bar",
  "/it/eventi",
  "/en/eventi",
  "/it/pacchetti-feste",
  "/en/pacchetti-feste",
  "/it/galleria",
  "/en/galleria",
  "/it/contatti",
  "/en/contatti",
  "/it/note-legali",
  "/en/note-legali",
];

/** Call after any admin edit that affects public pages, so changes show up
 * immediately instead of waiting for the next scheduled revalidation. */
export function revalidatePublicSite() {
  for (const path of PUBLIC_PATHS) revalidatePath(path);
}
