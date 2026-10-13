import CinematicHero from '@/components/home/CinematicHero';
import Link from '@/components/runtime/Link';
import WordPressContributions from '@/components/portfolio/WordPressContributions';
import Navigation from "@/components/ui/Navigation";
import { ArrowRight, Award, CheckCircle, Code, Coffee, Globe, Mail, Shield, Sparkles, Target, Trophy } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Navigation overlay />
      <div className="bg-gray-950 text-gray-100">
        {/* Hero Section */}
        <CinematicHero sceneKey="about" />

        {/* About Content */}
        <section id="about-content" tabIndex={-1} className="noir-content-section relative py-16 px-4">
          <div className="max-w-7xl mx-auto">
            
            {/* Bio Section */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">La Mia Storia</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    Sono <span className="text-blue-400 font-semibold">Amedeo Galletta, theWebRooster</span>. Sviluppo siti e applicazioni web, con un lavoro che unisce interfaccia, logica applicativa e strumenti per gestire i contenuti.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Nei miei lavori recenti ho realizzato i temi <span className="text-purple-400 font-semibold">Morgante Group, Morgante Costruzioni, Morgante Home Solution e Forno Atelier</span>: dalla comunicazione aziendale al catalogo e-commerce, fino a mappe e configuratori personalizzati.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Con <span className="text-blue-400 font-semibold">DatRooster Partial Payments</span> ho portato un mio plugin nella directory WordPress.org. Su GitHub condivido anche Treasure Coupons, il tema Marcello Scavo Tattoo, IRC Community e il codice di questo portfolio.
                  </p>
                </div>
                
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-yellow-400" />
                    Focus Principale
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Sviluppo di applicazioni web scalabili</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Ricerca e analisi di vulnerabilità</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Architettura e design di sistemi</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Consulenza tecnica specializzata</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <Code className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">Development</h3>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    React, Next.js, TypeScript
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    WordPress, WooCommerce, PHP
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    MySQL, PostgreSQL, Prisma
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    JavaScript, CSS, Tailwind
                  </li>
                </ul>
              </div>
              
              <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <Shield className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">Security</h3>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    Penetration Testing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    Bug Bounty Programs
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    Security Auditing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    Vulnerability Research
                  </li>
                </ul>
              </div>
              
              <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <Globe className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">Architecture</h3>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    API e strutture dati
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    Temi e plugin modulari
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    Configuratori e flussi ordine
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    Hosting PHP e build frontend
                  </li>
                </ul>
              </div>
              
              <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <Award className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">Consulenza</h3>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                    Technical Consulting
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                    Code Review
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                    Documentazione e consegna
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                    Project Planning
                  </li>
                </ul>
              </div>
            </div>
            
            <WordPressContributions />

            <section className="mt-12 grid md:grid-cols-3 gap-6" aria-label="Come lavoro">
              {[['01 · Definire','Parto dai contenuti, dalle persone che useranno il sito e dalle operazioni che devono svolgere.'],['02 · Sviluppare','Organizzo template e funzioni in componenti e moduli, così che il progetto possa essere aggiornato nel tempo.'],['03 · Verificare','Controllo flussi, pannello e layout sui diversi schermi, documentando configurazione e limiti del progetto.']].map(([title,text])=><div key={title} className="rounded-xl p-6 bg-gray-900/50 border border-gray-800"><h2 className="text-lg text-yellow-400 font-semibold mb-3">{title}</h2><p className="text-gray-300 leading-relaxed text-sm">{text}</p></div>)}
            </section>

            {/* Call to Action */}
            <div className="mt-16 text-center bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Interessato a Collaborare?
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Sono sempre aperto a nuove sfide e progetti interessanti. 
                Discutiamo di come posso aiutare il tuo prossimo progetto!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-400 hover:to-purple-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Contattami
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/projects"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 text-white border border-gray-700 font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Trophy className="w-5 h-5" />
                  Vedi i Miei Progetti
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
