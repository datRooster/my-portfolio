'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  ArrowRight, 
  ArrowLeft,
  Smartphone,
  Key,
  Settings
} from 'lucide-react';

export default function Setup2FAChoice() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSkip2FA = async () => {
    setLoading(true);
    
    // Per ora, simula la creazione di un token di autenticazione senza 2FA
    // In produzione, aggiorna il database per indicare che l'utente ha scelto di non usare 2FA
    
    try {
      const response = await fetch('/api/auth/skip-2fa', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        console.error('Failed to skip 2FA setup');
      }
    } catch (error) {
      console.error('Error skipping 2FA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetup2FA = () => {
    router.push('/login/setup-2fa');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Configurazione Sicurezza</h2>
          <p className="mt-2 text-sm text-gray-400">
            Scegli il livello di sicurezza per il tuo account
          </p>
        </div>

        {/* Security Recommendation */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-yellow-400 font-semibold text-lg mb-2">Raccomandazione di Sicurezza</p>
              <p className="text-gray-300 text-sm mb-3">
                L'autenticazione a due fattori (2FA) protegge il tuo account anche se qualcuno scopre la tua password. 
                È <strong className="text-yellow-400">fortemente raccomandato</strong> per account amministratore.
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Con 2FA: Sicurezza Militare</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <span>Senza 2FA: Sicurezza Standard</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Choice Options */}
        <div className="space-y-4">
          {/* Setup 2FA Option */}
          <button
            onClick={handleSetup2FA}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl p-6 transition-all transform hover:scale-[1.02] shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold mb-1">Configura 2FA (Raccomandato)</h3>
                <p className="text-green-100 text-sm">
                  Massima sicurezza con autenticazione a due fattori
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-green-200">
                  <span className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Sicurezza Militare</span>
                  <span className="flex items-center"><Smartphone className="w-3 h-3 mr-1" />App Authenticator</span>
                  <span className="flex items-center"><Key className="w-3 h-3 mr-1" />Codici Backup</span>
                </div>
              </div>
              <div className="text-white/80">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </button>

          {/* Skip 2FA Option */}
          <button
            onClick={handleSkip2FA}
            disabled={loading}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-xl p-6 transition-all border border-gray-600 disabled:opacity-50"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-bold mb-1">Accesso Rapido</h3>
                <p className="text-gray-300 text-sm">
                  Continua senza 2FA (puoi configurarlo dopo)
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center"><AlertTriangle className="w-3 h-3 mr-1" />Sicurezza Standard</span>
                  <span className="flex items-center"><Settings className="w-3 h-3 mr-1" />Configurabile dopo</span>
                </div>
              </div>
              <div className="text-gray-400">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ArrowRight className="w-6 h-6" />
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-white mb-2 flex items-center">
              <Smartphone className="w-4 h-4 mr-1" />
              App Consigliate per 2FA
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div className="flex items-center"><Shield className="w-3 h-3 mr-1" />Google Authenticator</div>
              <div className="flex items-center"><Shield className="w-3 h-3 mr-1" />Microsoft Authenticator</div>
              <div className="flex items-center"><Zap className="w-3 h-3 mr-1" />Authy</div>
              <div className="flex items-center"><Key className="w-3 h-3 mr-1" />1Password</div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Puoi sempre configurare o disabilitare 2FA dalle impostazioni
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="flex items-center justify-center text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Torna al Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}