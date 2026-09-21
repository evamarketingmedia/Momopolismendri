import "server-only";
import { Resend } from "resend";
import type { Booking } from "./bookings-store";
import { siteConfig } from "./site-config";

type EmailDetails = { bookingBlock:string; eventName:string; quoteTotal:number };
const notice = [
  "Il presente documento non rappresenta in alcun modo una ricevuta d’acquisto o un’offerta ufficiale.",
  "La prenotazione si intende confermata solo dopo la comunicazione da parte di Momòpolis – Family Bar & Park e il versamento dell’acconto di CHF 150 tramite i canali indicati.",
  "Il saldo dovrà essere effettuato in loco il giorno stesso, al termine dell’evento, tenuto conto degli eventuali extra e delle variazioni nel numero dei partecipanti.",
];
function client(){return process.env.RESEND_API_KEY?new Resend(process.env.RESEND_API_KEY):null;}
function from(){return process.env.RESEND_FROM_EMAIL||`${siteConfig.name} <onboarding@resend.dev>`;}
function esc(value:string|number){return String(value).replace(/[&<>"']/g,(x)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[x]!));}
function shortId(id:string){return id.split("-")[0].toUpperCase();}
function blockLabel(block:string){return block==="morning"?"Mattina":block==="afternoon"?"Pomeriggio":block==="full_day"?"Giornata":"—";}
function subject(b:Booking,d:EmailDetails){return `${b.date} · ${d.eventName||b.partyType} · ${b.participants} partecipanti · Prev. ${shortId(b.id)} · CHF ${d.quoteTotal}`;}
function html(b:Booking,d:EmailDetails){const rows=[["Numero preventivo",shortId(b.id)],["Data",b.date],["Blocco",blockLabel(d.bookingBlock)],["Nome evento",d.eventName||b.partyType],["Richiedente",b.name],["Telefono",b.phone],["E-mail",b.email],["Partecipanti",b.participants],["Totale indicativo",`CHF ${d.quoteTotal}`]];return `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f6f7f2;padding:24px;color:#0c0d0b"><div style="max-width:720px;margin:auto;background:white;border-radius:24px;overflow:hidden;border:1px solid #ddd"><div style="padding:24px;background:linear-gradient(90deg,#ff6b21,#a6ff00)"><h1 style="margin:0;font-size:24px">Momòpolis – Riepilogo richiesta</h1></div><div style="padding:24px"><p>È stata completata una nuova richiesta dal preventivatore. Di seguito trovi il riepilogo completo delle informazioni selezionate.</p><table style="width:100%;border-collapse:collapse">${rows.map(([k,v])=>`<tr><th style="text-align:left;padding:10px;border-bottom:1px solid #eee;width:38%">${esc(k)}</th><td style="padding:10px;border-bottom:1px solid #eee">${esc(v)}</td></tr>`).join("")}</table><h2 style="margin-top:28px">Dettagli compilati</h2><pre style="white-space:pre-wrap;background:#f6f7f2;padding:16px;border-radius:14px;font-family:Arial,sans-serif">${esc(b.message||"")}</pre><div style="margin-top:24px;padding:18px;border:2px solid #ff6b21;border-radius:14px;font-weight:bold">${notice.map(x=>`<p style="margin:8px 0">• ${esc(x)}</p>`).join("")}</div><p style="margin-top:24px"><b>Contattare il cliente entro 24 ore</b> per confermare la festa e discutere i dettagli.</p><p><b>Momòpolis – Family Bar & Park</b></p></div></div></body></html>`;}
function text(b:Booking,d:EmailDetails){return [`RIEPILOGO RICHIESTA MOMÒPOLIS`,`Preventivo: ${shortId(b.id)}`,`Data: ${b.date}`,`Blocco: ${blockLabel(d.bookingBlock)}`,`Evento: ${d.eventName||b.partyType}`,`Cliente: ${b.name}`,`Telefono: ${b.phone}`,`E-mail: ${b.email}`,`Partecipanti: ${b.participants}`,`Totale indicativo: CHF ${d.quoteTotal}`,"",b.message||"","",...notice.map(x=>`• ${x}`)].join("\n");}

export async function sendBookingEmails(booking:Booking,details:EmailDetails):Promise<void>{const resend=client();if(!resend){console.warn(`[email] RESEND_API_KEY not set — skipping notification for booking ${booking.id}`);return;}const staff=process.env.BOOKING_NOTIFICATION_EMAIL||siteConfig.email;const result=await resend.emails.send({from:from(),to:staff,replyTo:booking.email,subject:subject(booking,details),html:html(booking,details),text:text(booking,details)});if(result.error)console.error(`[email] failed to send staff notification for booking ${booking.id}`,result.error);}
