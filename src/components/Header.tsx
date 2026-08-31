"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import type { Locale, Dictionary } from "@/lib/dictionaries";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ locale }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:px-8 sm:py-3">
        <div className="flex min-w-0 items-center gap-2">
          {!isHome && <Link href={`/${locale}`} aria-label={locale === "it" ? "Torna alla home" : "Back to home"} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-momo-green-neon text-momo-black shadow-sm transition hover:bg-momo-orange"><ArrowLeft size={20}/></Link>}
          <Link
            href={`/${locale}`}
            className="relative h-12 w-36 shrink-0 sm:h-14 sm:w-48"
            aria-label="Momopolis — torna alla home"
          >
            <Image
              src="/momopolis/logo-header-originale.webp"
              alt="Momopolis Family Bar & Park"
              fill
              priority
              sizes="(max-width: 640px) 144px, 192px"
              className="object-contain object-left"
            />
          </Link>
        </div>
        <div className="rounded-full bg-white/95 p-1.5 shadow-lg backdrop-blur">
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}
