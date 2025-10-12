import Navigation from "@/components/ui/Navigation";
import { Code, Shield, Globe, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Navigation showBackButton={true} backUrl="/" backLabel="Home" />
      <div className="bg-gray-950 text-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Chi Sono
            </h1>
            <p className="text-gray-400 text-lg">
              Architect, Security Researcher e Web Developer
            </p>
          </div>
          
          {/* Bio Section */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">La Mia Storia</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Sono un developer appassionato di sicurezza informatica e architettura software. 
              La mia esperienza spazia dal web development alla ricerca di vulnerabilità, 
              passando per la consulenza tecnica e l'ottimizzazione di sistemi complessi.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Amo risolvere problemi complessi e creare soluzioni innovative che uniscano 
              funzionalità, sicurezza e design elegante.
            </p>
          </div>
          
          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Development</h3>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li>• React, Next.js, TypeScript</li>
                <li>• Node.js, Python, PHP</li>
                <li>• PostgreSQL, MongoDB</li>
                <li>• Docker, AWS, CI/CD</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-semibold text-white">Security</h3>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li>• Penetration Testing</li>
                <li>• Bug Bounty Programs</li>
                <li>• Security Auditing</li>
                <li>• Vulnerability Research</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-semibold text-white">Architecture</h3>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li>• System Design</li>
                <li>• Microservices</li>
                <li>• API Development</li>
                <li>• Performance Optimization</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-semibold text-white">Consulenza</h3>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li>• Technical Consulting</li>
                <li>• Code Review</li>
                <li>• Team Mentoring</li>
                <li>• Project Planning</li>
              </ul>
            </div>
          </div>
          
          {/* Contact CTA */}
          <div className="text-center bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Interessato a collaborare?
            </h3>
            <p className="text-gray-300 mb-6">
              Sono sempre aperto a nuove sfide e progetti interessanti
            </p>
            <a
              href="/contatti"
              className="inline-block px-8 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg shadow hover:bg-yellow-400 transition"
            >
              Contattami
            </a>
          </div>
        </div>
      </div>
    </>
  );
}