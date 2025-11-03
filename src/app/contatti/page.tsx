import Navigation from "@/components/ui/Navigation";
import { Mail, Phone, MapPin, Github, Linkedin, MessageCircle, Zap } from "lucide-react";
import Link from "next/link";

export default function ContattiPage() {
  return (
    <>
      <Navigation showBackButton={true} backUrl="/" backLabel="Home" />
      <div className="bg-gray-950 text-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Contattami
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              Hai un progetto in mente? Parliamone!
            </p>
            
            {/* CTA per la nuova chat */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
              <MessageCircle className="w-5 h-5 text-green-400" />
              <div className="text-left">
                <div className="text-sm font-semibold text-white">
                  Preferisci parlare in tempo reale?
                </div>
                <div className="text-xs text-gray-400">
                  Prova la nostra nuova chat community
                </div>
              </div>
              <Link 
                href="/contact"
                className="ml-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Vai alla Chat
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-6 text-white">Invia un Messaggio</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Il tuo nome"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="la-tua-email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Oggetto
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Di cosa vuoi parlare?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Messaggio
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                    placeholder="Raccontami del tuo progetto..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Invia Messaggio
                </button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                <h2 className="text-2xl font-semibold mb-6 text-white">Informazioni di Contatto</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-yellow-400" />
                    <div>
                      <p className="font-medium text-white">Email</p>
                      <p className="text-gray-400">contact@webrooster.it</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-yellow-400" />
                    <div>
                      <p className="font-medium text-white">Telefono</p>
                      <p className="text-gray-400">Su richiesta</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-yellow-400" />
                    <div>
                      <p className="font-medium text-white">Ubicazione</p>
                      <p className="text-gray-400">Italia, lavoro remoto</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-4 text-white">Seguimi</h3>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/datRooster"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Github className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="https://linkedin.com/in/theweb-rooster"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-6 h-6 text-white" />
                  </a>
                </div>
              </div>
              
              {/* Response Time */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">Tempo di Risposta</h3>
                <p className="text-green-400 text-sm">
                  Rispondo solitamente entro 24 ore
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}