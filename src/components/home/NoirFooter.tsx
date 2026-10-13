import { ArrowUp, ArrowUpRight } from 'lucide-react';
import Link from '@/components/runtime/Link';

export default function NoirFooter() {
  return <footer className="noir-home noir-footer"><div className="noir-container">
    <div className="noir-footer-top"><Link href="/" className="noir-footer-brand">theWebRooster<span>.</span></Link><a href="mailto:contact@webrooster.it" className="noir-text-link">contact@webrooster.it <ArrowUpRight size={16} /></a><button onClick={() => window.scrollTo({top: 0, behavior: 'instant'})} className="noir-text-link">Torna all’inizio <ArrowUp size={16} /></button></div>
    <div className="noir-footer-bottom"><span>© {new Date().getFullYear()} Amedeo Galletta · theWebRooster</span><div><a href="https://github.com/datRooster" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://profiles.wordpress.org/datroooster/" target="_blank" rel="noopener noreferrer">WordPress.org ↗</a><Link href="/admin">Admin</Link></div><span>Ideato e sviluppato in Italia.</span></div>
  </div></footer>;
}
