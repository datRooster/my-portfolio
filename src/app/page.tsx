import { ArrowUpRight, Code2, Languages, Puzzle } from 'lucide-react';
import CinematicHero from '@/components/home/CinematicHero';
import SelectedWork from '@/components/home/SelectedWork';
import Link from '@/components/runtime/Link';
import Navigation from '@/components/ui/Navigation';
import '@/components/home/noir.css';

const contributions = [
  { title: 'Plugin Developer', label: 'WordPress.org', text: 'DatRooster Partial Payments, pubblicato nella directory ufficiale.', Icon: Puzzle, href: 'https://wordpress.org/plugins/datrooster-partial-payments/' },
  { title: 'Translation Contributor', label: 'WordPress community', text: 'Un contributo alla community, anche attraverso le traduzioni.', Icon: Languages, href: 'https://profiles.wordpress.org/datroooster/' },
  { title: 'Codice da esplorare', label: 'GitHub', text: 'Repository pubbliche, esperimenti e progetti in evoluzione.', Icon: Code2, href: 'https://github.com/datRooster' },
];
const services = [
  { number: '01', title: 'Siti & temi WordPress', text: 'Un’identità riconoscibile, un tema dedicato e contenuti semplici da gestire.' },
  { number: '02', title: 'WooCommerce & plugin', text: 'Funzionalità pensate per i tuoi processi: dagli acconti ai configuratori di prodotto.' },
  { number: '03', title: 'Applicazioni web', text: 'Interfacce, logica e pannelli di gestione costruiti intorno alle tue esigenze.' },
];

export default function Home() {
  return (
    <div className="noir-home">
      <Navigation cinematic overlay />
      <CinematicHero />
      <div className="noir-specialties" aria-label="Ambiti di sviluppo">
        <div className="noir-container"><span>Temi su misura</span><i>✳</i><span>Plugin WooCommerce</span><i>✳</i><span>Applicazioni web</span><i>✳</i><span>Codice aperto</span></div>
      </div>
      <SelectedWork />
      <section className="noir-community noir-container" aria-labelledby="community-title">
        <div className="noir-community-copy">
          <p className="noir-eyebrow">02 / Open source, per davvero</p>
          <h2 id="community-title">Costruire.<br />Condividere.<br /><em>Contribuire.</em></h2>
          <p>Il codice ha più valore quando diventa utile anche agli altri. Con DatRooster Partial Payments porto acconti e saldi dentro WooCommerce. E con le traduzioni contribuisco alla community WordPress.</p>
          <a href="https://wordpress.org/plugins/datrooster-partial-payments/" target="_blank" rel="noopener noreferrer" className="noir-text-link">Il mio plugin su WordPress.org <ArrowUpRight size={18} /></a>
        </div>
        <div className="noir-contributions">
          {contributions.map(({ title, label, text, Icon, href }) => (
            <a href={href} key={title} target="_blank" rel="noopener noreferrer" className="noir-contribution">
              <Icon size={26} strokeWidth={1.3} /><div><span>{label}</span><h3>{title}</h3><p>{text}</p></div><ArrowUpRight size={20} />
            </a>
          ))}
        </div>
      </section>
      <section className="noir-services noir-container" aria-labelledby="services-title">
        <div className="noir-section-heading"><div><p className="noir-eyebrow">03 / Dall’idea al lancio</p><h2 id="services-title">Cosa posso<br />fare <em>per te.</em></h2></div><Link href="/services" className="noir-text-link">Tutti i servizi <ArrowUpRight size={18} /></Link></div>
        <div className="noir-service-list">
          {services.map(service => (
            <Link href="/services" key={service.number} className="noir-service"><span>{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><ArrowUpRight size={26} /></Link>
          ))}
        </div>
      </section>
      <section className="noir-contact noir-container" aria-labelledby="contact-title">
        <p className="noir-eyebrow">Il prossimo progetto potrebbe essere il tuo.</p>
        <Link href="/contact" className="noir-contact-link"><h2 id="contact-title">Facciamolo<br /><em>succedere.</em></h2><ArrowUpRight strokeWidth={1} /></Link>
        <div className="noir-contact-bottom"><p>Raccontami la tua idea. Partiamo da lì.</p><Link href="/contact" className="noir-text-link">Parliamone <ArrowUpRight size={18} /></Link></div>
      </section>
    </div>
  );
}
