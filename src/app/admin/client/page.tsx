import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, ClipboardList } from "lucide-react";
import { getAdminRole } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Gestione prenotazioni · Momopolis Admin", robots: { index: false, follow: false } };

export default async function ClientAdminPage() {
  const role = await getAdminRole();
  if (!role) redirect("/admin/client/login");
  if (role === "owner") redirect("/admin");
  const cards = [
    { title: "Disponibilità", text: "Visualizza e gestisci le date disponibili nel calendario.", href: "/admin/availability", Icon: CalendarDays },
    { title: "Prenotazioni", text: "Consulta le persone che hanno completato il preventivatore e apri le loro scelte.", href: "/admin/bookings", Icon: ClipboardList },
  ];
  return <main className="min-h-screen bg-momo-cream px-5 py-10"><div className="mx-auto max-w-4xl">
    <p className="text-xs font-extrabold uppercase tracking-[.18em] text-momo-orange">Momòpolis Admin cliente</p>
    <h1 className="font-display mt-2 text-3xl font-extrabold">Gestione operativa</h1>
    <div className="mt-8 grid gap-5 sm:grid-cols-2">{cards.map(({ title, text, href, Icon }) => <Link key={title} href={href} className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-momo-orange"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-momo-green-neon"><Icon /></span><h2 className="font-display mt-5 text-2xl font-extrabold">{title}</h2><p className="mt-2 text-sm text-momo-black/60">{text}</p></Link>)}</div>
  </div></main>;
}
