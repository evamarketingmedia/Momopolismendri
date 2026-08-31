"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { PartyChoice } from "@/lib/party-config";

export default function PartyChoicesEditor({name,label,initial}:{name:string;label:string;initial:PartyChoice[]}) {
  const [items,setItems]=useState(initial);
  const update=(index:number,field:keyof PartyChoice,value:string)=>setItems(current=>current.map((item,i)=>i===index?{...item,[field]:field==="price"?Number(value):value}:item));
  return <fieldset className="rounded-2xl border border-black/10 bg-momo-cream-dim p-5">
    <legend className="px-2 font-display text-xl font-extrabold">{label}</legend>
    <input type="hidden" name={name} value={JSON.stringify(items)}/>
    <div className="space-y-3">{items.map((item,index)=><div key={`${item.id}-${index}`} className="grid gap-3 rounded-xl bg-white p-4 sm:grid-cols-[1fr_2fr_110px_auto]">
      <label className="text-xs font-bold">Nome<input value={item.label} onChange={e=>update(index,"label",e.target.value)} className="momo-input mt-1"/></label>
      <label className="text-xs font-bold">Descrizione<input value={item.description} onChange={e=>update(index,"description",e.target.value)} className="momo-input mt-1"/></label>
      <label className="text-xs font-bold">Prezzo CHF<input type="number" min="0" step="0.5" value={item.price} onChange={e=>update(index,"price",e.target.value)} className="momo-input mt-1"/></label>
      <button type="button" aria-label={`Elimina ${item.label}`} onClick={()=>setItems(current=>current.filter((_,i)=>i!==index))} className="mt-5 grid h-10 w-10 place-items-center rounded-full border border-red-200 text-red-600"><Trash2 size={17}/></button>
    </div>)}</div>
    <button type="button" onClick={()=>setItems(current=>[...current,{id:`${name}-${Date.now()}`,label:"Nuova voce",description:"",price:0}])} className="mt-4 inline-flex items-center gap-2 rounded-full bg-momo-green-neon px-4 py-2 text-sm font-extrabold"><Plus size={17}/> Aggiungi voce</button>
  </fieldset>;
}
