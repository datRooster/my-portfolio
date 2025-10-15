import Navigation from "@/components/ui/Navigation";
import Link from "next/link";
import { 
  Code, 
  Shield, 
  Globe, 
  Award, 
  User,
  Sparkles,
  Trophy,
  Target,
  ArrowRight,
  Mail,
  Coffee,
  Heart,
  Zap,
  CheckCircle,
  Star
} from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Navigation showBackButton={true} backUrl="/" backLabel="Home" />
      <div className="bg-gray-950 text-gray-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-8 animate-pulse">
              <User className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Chi Sono
              </span>
              <br />
              <span className="text-white">theWebRooster</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Developer appassionato di sicurezza informatica e architettura software. 
              La mia esperienza spazia dal web development alla ricerca di vulnerabilità.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">5+</div>
                <div className="text-sm text-gray-400">Anni di Esperienza</div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <Star className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-400">Progetti Completati</div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <Shield className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">20+</div>
                <div className="text-sm text-gray-400">Bug Trovati</div>
              </div>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="relative py-16 px-4">
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
                    Sono un <span className="text-blue-400 font-semibold">developer full-stack</span> appassionato di sicurezza informatica e architettura software. 
                    La mia esperienza spazia dal web development alla ricerca di vulnerabilità, 
                    passando per la consulenza tecnica e l'ottimizzazione di sistemi complessi.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Amo risolvere <span className="text-purple-400 font-semibold">problemi complessi</span> e creare soluzioni innovative che uniscano 
                    funzionalità, sicurezza e design elegante.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Nel tempo libero, partecipo a <span className="text-red-400 font-semibold">programmi bug bounty</span> e contribuisco 
                    a progetti open source, sempre alla ricerca di nuove sfide tecniche.
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
                    Node.js, Python, PHP
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    PostgreSQL, MongoDB
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Docker, AWS, CI/CD
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
                    System Design
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    Microservices
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    API Development
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    Performance Optimization
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
                    Team Mentoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                    Project Planning
                  </li>
                </ul>
              </div>
            </div>
            
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