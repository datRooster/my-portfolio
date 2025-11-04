'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { Card } from './card';
import { Button } from './button';

interface WebchatEmbedProps {
  /** URL della webchat deployata su Railway */
  webchatUrl?: string;
  /** Titolo del widget */
  title?: string;
  /** Descrizione del widget */
  description?: string;
  /** Se true, mostra la chat in modalità full-page invece che widget */
  fullPage?: boolean;
  /** Classe CSS personalizzata */
  className?: string;
}

export default function WebchatEmbed({
  webchatUrl = 'https://web-production-75688.up.railway.app',
  title = 'Chat in Tempo Reale',
  description = 'Parla direttamente con me tramite la nostra community chat',
  fullPage = false,
  className = ''
}: WebchatEmbedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen || fullPage) {
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, fullPage]);

  // Modalità full-page per la pagina contatti
  if (fullPage) {
    return (
      <div className={`w-full h-full min-h-[600px] ${className}`}>
        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 h-full overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="text-sm text-gray-400">{description}</p>
                </div>
              </div>
              <a
                href={webchatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Apri in nuova finestra
              </a>
            </div>
          </div>

          {/* iFrame Container */}
          <div className="relative w-full" style={{ height: 'calc(100% - 80px)' }}>
            {isLoading && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Caricamento chat...</p>
                </div>
              </div>
            )}
            <iframe
              src={webchatUrl}
              className="w-full h-full border-0"
              title="IRC Community Chat"
              allow="microphone; camera"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => setIsLoading(false)}
            />
          </div>

          {/* Info Footer */}
          <div className="bg-gray-900/80 border-t border-gray-800 p-3">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Chat in tempo reale - Devi registrarti per partecipare</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                  Autenticazione sicura
                </span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                  Gratuita
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Modalità widget floating per altre pagine
  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
          aria-label="Apri chat"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-950 animate-pulse"></div>
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-gray-900 border border-gray-800 shadow-2xl transition-all duration-300 ${
            isMaximized
              ? 'inset-4 rounded-2xl'
              : 'bottom-6 right-6 w-[400px] h-[600px] rounded-2xl'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-gray-800 p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{title}</h4>
                  <p className="text-xs text-gray-400">Online ora</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label={isMaximized ? 'Riduci' : 'Espandi'}
                >
                  {isMaximized ? (
                    <Minimize2 className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <a
                  href={webchatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Apri in nuova finestra"
                >
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Chiudi"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* iFrame Container */}
          <div className="relative w-full" style={{ height: 'calc(100% - 64px)' }}>
            {isLoading && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 animate-pulse">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                  <p className="text-gray-400 text-sm">Caricamento...</p>
                </div>
              </div>
            )}
            <iframe
              src={webchatUrl}
              className="w-full h-full border-0 rounded-b-2xl"
              title="IRC Community Chat"
              allow="microphone; camera"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
