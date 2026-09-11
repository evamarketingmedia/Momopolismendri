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
      className="fixed bottom-5 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-3xl border-2 border-momo-green-neon bg-white px-6 py-5 pr-12 text-center shadow-2xl"
    >
      <button
        type="button"
        aria-label={locale === "it" ? "Chiudi avviso" : "Close notice"}
        onClick={() => setVisible(false)}
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-momo-cream-dim transition-colors hover:bg-momo-orange/20"
      >
        <X size={18} />
      </button>
      <p className="font-display text-xl font-extrabold text-momo-black">
        ✨ {locale === "it" ? "Sta arrivando Momòpolis!" : "Momòpolis is coming!"}
      </p>
      <p className="mt-1 font-bold text-momo-orange">
        {locale === "it" ? "Apertura prevista per ottobre 2026" : "Opening planned for October 2026"}
      </p>
    </aside>
  );
}
