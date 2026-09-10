import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/dictionaries";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { robots: { index: true, follow: true } };

export default async function LegalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const it = lang === "it";
  const sections = it ? privacyIt : privacyEn;

  return <>
    <PageHero kicker="Momòpolis" title={it ? "Note legali, privacy e cookie" : "Legal notice, privacy and cookies"} intro={it ? "Informazioni sul titolare del sito e sul trattamento dei dati personali." : "Information about the website owner and personal-data processing."} />
    <section className="py-16">
      <Container>
        <div className="mx-auto max-w-4xl space-y-12 rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm sm:p-10">
          <LegalSection title={it ? "Impressum e titolare" : "Legal notice and controller"}>
            <p>Momopolis – Spazio Libero SNC<br />Via Penate 7<br />6850 Mendrisio, Svizzera<br />CHE-441.806.563 IVA</p>
            <p className="mt-3">E-mail: <a className="font-bold underline" href="mailto:info@momopolis.ch">info@momopolis.ch</a><br />Tel. +41 91 226 63 76 · Mob. +41 76 621 63 76</p>
          </LegalSection>

          <div id="privacy" className="scroll-mt-28">
            <h2 className="font-display text-3xl font-extrabold">Privacy Policy</h2>
            <p className="mt-3 text-sm text-momo-black/55">{it ? "Ultimo aggiornamento: 20 agosto 2026" : "Last updated: 20 August 2026"}</p>
            <div className="mt-7 space-y-8">{sections.map(section => <LegalSection key={section.title} title={section.title}><p>{section.text}</p></LegalSection>)}</div>
          </div>

          <div id="cookie" className="scroll-mt-28 border-t border-black/10 pt-10">
            <h2 className="font-display text-3xl font-extrabold">Cookie Policy</h2>
            <div className="mt-7 space-y-8">
              <LegalSection title={it ? "Cosa sono i cookie" : "What cookies are"}><p>{it ? "I cookie sono piccoli file salvati dal browser. Questo sito utilizza cookie o tecnologie equivalenti strettamente necessari per il funzionamento, la sicurezza dell’area amministrativa e la gestione della lingua." : "Cookies are small files stored by the browser. This website uses cookies or equivalent technologies strictly necessary for operation, admin-area security and language management."}</p></LegalSection>
              <LegalSection title={it ? "Servizi esterni" : "Third-party services"}><p>{it ? "La mappa di Google Maps può trasmettere dati tecnici a Google e utilizzare cookie secondo le impostazioni del browser e del servizio. Supabase è utilizzato per autenticazione, contenuti e prenotazioni; Netlify per l’hosting; il fornitore e-mail per l’invio dei riepiloghi. Non utilizziamo cookie pubblicitari o di profilazione propri." : "Google Maps may transmit technical data to Google and use cookies according to browser and service settings. Supabase is used for authentication, content and bookings; Netlify for hosting; and the email provider for booking summaries. We do not use our own advertising or profiling cookies."}</p></LegalSection>
              <LegalSection title={it ? "Gestione e modifiche" : "Management and changes"}><p>{it ? "Puoi limitare o cancellare i cookie dalle impostazioni del browser; la disattivazione di quelli necessari può impedire il corretto funzionamento di alcune parti del sito. Questa informativa potrà essere aggiornata quando cambieranno i servizi utilizzati." : "You can restrict or delete cookies in your browser settings; disabling necessary cookies may prevent parts of the site from working correctly. This notice may be updated when the services used change."}</p></LegalSection>
            </div>
          </div>
        </div>
      </Container>
    </section>
  </>;
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h3 className="font-display text-xl font-extrabold text-momo-black">{title}</h3><div className="mt-3 leading-relaxed text-momo-black/70">{children}</div></section>;
}

const privacyIt = [
  { title: "Dati trattati", text: "Trattiamo i dati forniti volontariamente nei moduli, come nome, cognome, telefono, e-mail, dettagli dell’evento, partecipanti, osservazioni e preferenze. Durante la navigazione possono inoltre essere raccolti dati tecnici essenziali, come indirizzo IP, data e ora della richiesta e informazioni del browser." },
  { title: "Finalità e basi giuridiche", text: "Utilizziamo i dati per preparare preventivi, gestire e confermare prenotazioni, rispondere alle richieste, inviare i relativi riepiloghi, amministrare il servizio e rispettare obblighi legali. Il trattamento si basa sull’esecuzione di misure precontrattuali o contrattuali, sugli obblighi di legge e sul legittimo interesse alla sicurezza e al corretto funzionamento del servizio. Le comunicazioni promozionali saranno inviate soltanto con il consenso richiesto." },
  { title: "Destinatari e trasferimenti", text: "I dati sono accessibili al personale autorizzato e ai fornitori necessari alla gestione del sito, tra cui hosting, database e autenticazione, invio e-mail e assistenza tecnica. Alcuni fornitori possono trattare dati fuori dalla Svizzera o dallo SEE applicando le garanzie previste dalla normativa pertinente. I dati non vengono venduti." },
  { title: "Conservazione e sicurezza", text: "Conserviamo richieste e prenotazioni per il tempo necessario alla loro gestione e, di regola, non oltre 24 mesi dalla conclusione del rapporto, salvo termini più lunghi richiesti da obblighi contabili o legali. Adottiamo misure tecniche e organizzative adeguate, pur non potendo garantire una sicurezza assoluta delle trasmissioni via Internet." },
  { title: "Diritti dell’interessato", text: "Puoi chiedere accesso, rettifica, cancellazione, limitazione, opposizione e, quando applicabile, portabilità dei dati o revoca del consenso. Puoi inoltre rivolgerti all’Incaricato federale della protezione dei dati e della trasparenza o all’autorità competente. Per esercitare i tuoi diritti scrivi a info@momopolis.ch." },
];

const privacyEn = [
  { title: "Data processed", text: "We process data voluntarily supplied in forms, including name, surname, telephone number, email, event details, guest numbers, comments and preferences. Essential technical data such as IP address, request date and time and browser information may also be collected while browsing." },
  { title: "Purposes and legal bases", text: "We use data to prepare quotes, manage and confirm bookings, answer requests, send summaries, administer the service and meet legal duties. Processing is based on pre-contractual or contractual measures, legal obligations and our legitimate interest in service security and operation. Marketing messages are sent only where the required consent has been given." },
  { title: "Recipients and transfers", text: "Data is available to authorised staff and necessary website providers, including hosting, database and authentication, email delivery and technical support. Some providers may process data outside Switzerland or the EEA under the safeguards required by applicable law. We do not sell personal data." },
  { title: "Retention and security", text: "We retain enquiries and bookings for as long as necessary and generally no longer than 24 months after the relationship ends, unless longer accounting or legal retention applies. Appropriate technical and organisational safeguards are used, although absolute security of Internet transmission cannot be guaranteed." },
  { title: "Your rights", text: "You may request access, correction, deletion, restriction, objection and, where applicable, data portability or withdrawal of consent. You may also complain to the Swiss Federal Data Protection and Information Commissioner or another competent authority. Contact info@momopolis.ch to exercise your rights." },
];
