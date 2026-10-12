import Link from '@/components/runtime/Link';
import { ArrowUpRight, Languages, Puzzle } from 'lucide-react';

export default function WordPressContributions() {
  return (
    <section className="w-full border border-sky-500/25 bg-gradient-to-br from-sky-950/30 to-gray-900/60 rounded-2xl p-6 md:p-10" aria-labelledby="wordpress-contributions">
      <p className="text-sky-400 text-xs font-semibold tracking-widest uppercase mb-3">Open source · WordPress.org</p>
      <h2 id="wordpress-contributions" className="text-2xl md:text-3xl font-bold text-white mb-4">Creo strumenti. Condivido il codice.</h2>
      <p className="text-gray-300 leading-relaxed max-w-3xl mb-7">Con DatRooster Partial Payments porto acconti e saldi dentro WooCommerce. Il plugin è pubblicato nella directory ufficiale WordPress; contribuisco anche alla community attraverso le traduzioni.</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-7">
        {[{name:'Plugin Developer',text:'Badge sul mio profilo per lo sviluppo di plugin.',Icon:Puzzle},{name:'Translation Contributor',text:'Badge sul mio profilo per le contribuzioni alle traduzioni.',Icon:Languages}].map(({name,text,Icon}) => (
          <a key={name} href="https://profiles.wordpress.org/datroooster/" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-5 rounded-xl border border-gray-700 bg-gray-950/40 hover:border-sky-400 transition-colors">
            <Icon className="w-7 h-7 text-sky-400 shrink-0" aria-hidden="true" />
            <div><h3 className="text-white font-semibold mb-1">{name}</h3><p className="text-gray-400 text-sm">{text}</p></div>
            <ArrowUpRight className="w-4 h-4 shrink-0 text-gray-400 ml-auto" aria-hidden="true" />
          </a>
        ))}
      </div>
      <div className="flex flex-wrap gap-5 text-sm font-medium">
        <a href="https://wordpress.org/plugins/datrooster-partial-payments/" target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:text-white inline-flex gap-2 items-center">Il plugin su WordPress.org <ArrowUpRight className="w-4 h-4" /></a>
        <Link href="/projects/datrooster-partial-payments" className="text-gray-300 hover:text-white">Leggi la scheda progetto →</Link>
        <a href="https://github.com/datRooster/wp-plugins" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">Codice su GitHub ↗</a>
      </div>
    </section>
  );
}
