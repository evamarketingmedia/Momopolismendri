import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminRole } from "@/lib/admin-auth";
import { loginAction } from "../../actions";

export const metadata:Metadata={title:"Accesso gestione prenotazioni · Momopolis",robots:{index:false,follow:false}};

export default async function ClientLoginPage({searchParams}:{searchParams:Promise<{error?:string}>}){
  const role=await getAdminRole();
  if(role)redirect(role==="client"?"/admin/client":"/admin");
  const {error}=await searchParams;
  return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-momo-green-neon/35 via-white to-momo-orange/25 px-4"><div className="w-full max-w-sm rounded-3xl border-2 border-momo-green-neon bg-white p-8 shadow-xl">
    <p className="text-xs font-extrabold uppercase tracking-[.18em] text-momo-orange">Accesso cliente</p><h1 className="font-display mt-2 text-2xl font-extrabold">Momòpolis Gestione</h1><p className="mt-2 text-sm text-momo-black/60">Calendario, prenotazioni, orari, chiusure e preventivatore.</p>
    <form action={loginAction} className="mt-6 space-y-4"><input type="hidden" name="portal" value="client"/><label className="block text-sm font-bold">E-mail<input type="email" name="username" required autoComplete="username" className="momo-input mt-1.5"/></label><label className="block text-sm font-bold">Password<input type="password" name="password" required autoComplete="current-password" className="momo-input mt-1.5"/></label>{error&&<p className="text-sm font-bold text-red-600">E-mail o password non corrette.</p>}<button className="w-full rounded-full bg-momo-orange px-5 py-3 font-extrabold">Accedi</button></form>
  </div></div>;
}
