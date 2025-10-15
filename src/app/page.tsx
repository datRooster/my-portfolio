import Link from "next/link";
import CoinFlip from "@/components/layout/CoinFlip";
import Navigation from "@/components/ui/Navigation";
import VisitorCounter from "@/components/ui/VisitorCounter";
import { 
  Code2, 
  Shield, 
  Zap, 
  ArrowRight, 
  Mail,
  Sparkles,
  Trophy,
  Globe,
  User
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-gray-100 px-4">
        {/* Hero Section Moderna */}
        <section className="relative text-center mt-20 mb-20 max-w-6xl mx-auto">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 rounded-3xl"></div>
          <div className="absolute top-20 -left-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -right-20 w-52 h-52 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <div className="relative">
            {/* Avatar con effetto coin flip */}
            <div className="flex flex-col items-center mb-12 animate-fadeInUp">
              <div className="relative mb-8 mt-8">
                <CoinFlip flipInterval={3000} />
                {/* Glow effect intorno al coin flip */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-2xl scale-150 animate-pulse"></div>
              </div>
              
              {/* Status badge */}
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-8">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Disponibile per nuovi progetti</span>
              </div>
            </div>

            {/* Main Title */}
            <div className="mb-12 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                theWeb
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Rooster
                </span>
              </h1>
              
              {/* Animated subtitle */}
              <div className="space-y-3 mb-8">
                <p className="text-2xl md:text-3xl text-gray-300 font-light">
                  <span className="text-yellow-400">Architect</span> • <span className="text-orange-400">Security Researcher</span> • <span className="text-blue-400">Developer</span>
                </p>
                <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                  Creo soluzioni digitali innovative che uniscono <span className="text-yellow-400">performance</span>, 
                  <span className="text-red-400"> sicurezza</span> e <span className="text-green-400">design elegante</span>.
                  Dalla ricerca di vulnerabilità alle architetture scalabili.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              <Link
                href="/projects"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-semibold rounded-xl shadow-2xl shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Esplora i Progetti
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/about"
                className="group flex items-center gap-3 px-8 py-4 bg-gray-800/50 border border-gray-700 text-white font-semibold rounded-xl hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-105"
              >
                <User className="w-5 h-5" />
                Chi Sono
              </Link>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-6 mb-16 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-full">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">10+ Progetti</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-full">
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-300">Security Expert</span>
              </div>
              <Link
                href="/bug-bounty"
                className="group flex items-center gap-2 px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-full hover:bg-gray-700/50 hover:border-red-500/50 transition-all cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-yellow-400 group-hover:text-red-400 transition-colors" />
                <span className="text-sm text-gray-300 group-hover:text-red-300 transition-colors">Bug Bounty Hunter</span>
              </Link>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-full">
                <Globe className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Remote Worldwide</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section Moderna */}
        <section className="w-full max-w-6xl mb-20">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fadeInUp" style={{animationDelay: '0.8s'}}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Cosa Posso Fare Per Te
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Dalla concezione all'implementazione, creo soluzioni digitali complete e sicure
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Portfolio Card */}
            <Link 
              href="/projects" 
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-yellow-500/50 hover:bg-gray-800/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/10 animate-fadeInScale"
              style={{animationDelay: '1s'}}
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                {/* Icon container */}
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Code2 className="w-8 h-8 text-gray-900" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  Portfolio Progetti
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Esplora i progetti più significativi che ho sviluppato, dalle web app alle ricerche di sicurezza.
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs">React</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-xs">Next.js</span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-md text-xs">TypeScript</span>
                </div>
                
                {/* Arrow */}
                <div className="flex items-center justify-between">
                  <span className="text-yellow-500 text-sm font-medium">Scopri Ora</span>
                  <ArrowRight className="w-4 h-4 text-yellow-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Security Card */}
            <Link 
              href="/bug-bounty" 
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-red-500/50 hover:bg-gray-800/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/10 animate-fadeInScale"
              style={{animationDelay: '1.1s'}}
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                {/* Icon container */}
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                  Security Research
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Ricerca e scoperta di vulnerabilità, bug bounty hunting e consulenze di sicurezza informatica.
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-md text-xs">Penetration Testing</span>
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-md text-xs">Bug Bounty</span>
                </div>
                
                {/* Arrow */}

                <div className="flex items-center justify-between">
                  <span className="text-red-500 text-sm font-medium">Esplora</span>
                  <ArrowRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Services Card */}
            <a 
              href="/services" 
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-green-500/50 hover:bg-gray-800/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/10 animate-fadeInScale"
              style={{animationDelay: '1.2s'}}
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                {/* Icon container */}
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                  Servizi & Consulenze
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Consulenze tecniche, sviluppo custom, audit di sicurezza e formazione specializzata.
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-xs">Consulting</span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs">Development</span>
                </div>
                
                {/* Arrow */}
                <div className="flex items-center justify-between">
                  <span className="text-green-500 text-sm font-medium">Scopri Servizi</span>
                  <ArrowRight className="w-4 h-4 text-green-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* Contact & Social Section */}
        <section className="w-full max-w-4xl text-center animate-fadeInUp" style={{animationDelay: '1.4s'}}>
          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Hai un Progetto in Mente?
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Sono sempre alla ricerca di nuove sfide e collaborazioni interessanti. 
              Parliamo del tuo prossimo progetto!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                Iniziamo a Parlare
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-gray-500 text-sm">Rispondo entro 24 ore</span>
            </div>
          </div>


        </section>
        
        {/* Visitor Counter floating */}
        <VisitorCounter 
          variant="floating" 
          position="bottom-right"
        />
    </div>
    </>
  );
}