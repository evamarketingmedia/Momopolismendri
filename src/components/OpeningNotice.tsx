"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Locale } from "@/lib/dictionaries";

export default function OpeningNotice({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <aside
      role="status"
      className="fixed left-1/2 top-1/2 z-[100] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border-2 border-momo-green-neon bg-black px-8 py-9 pr-14 text-center text-white shadow-[0_24px_80px_rgba(0,0,0,.55)] sm:px-12 sm:py-11"
    >
      <button
        type="button"
        aria-label={locale === "it" ? "Chiudi avviso" : "Close notice"}
        onClick={() => setVisible(false)}
        className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
      >
        <X size={18} />
      </button>
      <p className="font-display text-2xl font-extrabold sm:text-3xl">
        ✨ {locale === "it" ? "Sta arrivando Momòpolis!" : "Momòpolis is coming!"}
      </p>
      <p className="mt-3 text-lg font-bold text-momo-orange sm:text-xl">
        {locale === "it" ? "Apertura prevista per ottobre 2026" : "Opening planned for October 2026"}
      </p>
    </aside>
  );
}
