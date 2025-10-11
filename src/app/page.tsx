import Link from "next/link";
import CoinFlip from "@/components/layout/CoinFlip";
import { Wrench, Lock, ShoppingCart } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-gray-100 px-4">
      {/* Hero Section */}
      <section className="text-center mt-20 mb-16">
        {/* Logo/avatar */}
        <div className="flex flex-col items-center mb-16">
          {/* Effetto moneta rotante con due facce */}
          <CoinFlip flipInterval={3000} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          theWebRooster
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-6">
          Architect, Security Researcher, Web Developer.<br />
          Portfolio, progetti, bug bounty e servizi di consulenza.
        </p>
        <a
          href="/shop"
          className="inline-block px-8 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg shadow hover:bg-yellow-400 transition"
        >
          Scopri i Servizi
        </a>
      </section>

      {/* Quick Links Section */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {/* Portfolio */}
        <Link href="/projects" className="block bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition shadow-lg text-center">
          <div className="flex justify-center mb-4">
            <Wrench className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="font-bold text-xl mb-1">Progetti</h2>
          <p className="text-gray-400 text-sm">Scopri i progetti più importanti e recenti.</p>
        </Link>
        {/* Bug Bounty */}
        <a href="/bugbounty" className="block bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition shadow-lg text-center">
          <div className="flex justify-center mb-4">
            <Lock className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="font-bold text-xl mb-1">Bug Bounty</h2>
          <p className="text-gray-400 text-sm">Le mie attività di sicurezza e vulnerabilità scoperte.</p>
        </a>
        {/* Shop */}
        <a href="/shop" className="block bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition shadow-lg text-center">
          <div className="flex justify-center mb-4">
            <ShoppingCart className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="font-bold text-xl mb-1">Servizi & Shop</h2>
          <p className="text-gray-400 text-sm">Consulenze, corsi, prodotti digitali.</p>
        </a>
      </section>

      {/* Social Links */}
      <section className="flex gap-6 mb-12">
        <a
          href="https://github.com/datRooster/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-yellow-500 transition"
          title="GitHub"
        >
          <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.56v-2c-3.2.7-3.87-1.55-3.87-1.55-.52-1.3-1.28-1.65-1.28-1.65-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.72-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.45.11-3.01 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.56.23 2.72.11 3.01.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.41.36.77 1.08.77 2.18v3.24c0 .31.21.67.79.56A11.52 11.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/></svg>
        </a>
        <a
          href="https://www.linkedin.com/in/amedeo-galletta-812835292/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-yellow-500 transition"
          title="LinkedIn"
        >
          <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.78-1.75-1.72s.78-1.72 1.75-1.72 1.75.78 1.75 1.72-.78 1.72-1.75 1.72zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47s-1.73 1.18-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.76 1.37-1.56 2.81-1.56 3.01 0 3.56 1.98 3.56 4.56v5.77z"/></svg>
        </a>
        {/* Aggiungi altri social se vuoi */}
      </section>
    </main>
  );
}