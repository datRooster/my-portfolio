'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TwoFactorResponse {
  success: boolean;
  message?: string;
}

export default function TwoFactorPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const router = useRouter();

  useEffect(() => {
    // Check if user has temp token from login
    const tempToken = sessionStorage.getItem('tempToken');
    if (!tempToken) {
      router.push('/login');
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const tempToken = sessionStorage.getItem('tempToken');
    if (!tempToken) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-2fa-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
        credentials: 'include',
      });

      const data: TwoFactorResponse = await response.json();

      if (data.success) {
        // Clean up temp token
        sessionStorage.removeItem('tempToken');
        // Redirect to admin panel
        router.push('/admin');
      } else {
        setError(data.message || 'Codice non valido');
        setCode(''); // Clear the input
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      setError('Errore di connessione. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(value);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-black">🔐</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Autenticazione a Due Fattori</h2>
          <p className="mt-2 text-sm text-gray-400">
            Inserisci il codice dalla tua app di autenticazione
          </p>
        </div>

        {/* Security Status */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-400">✅</span>
              </div>
              <div>
                <p className="text-green-400 font-semibold text-sm">Login Fase 1 Completata</p>
                <p className="text-gray-400 text-xs">Credenziali verificate con successo</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-yellow-400 font-bold text-lg">{formatTime(timeLeft)}</p>
              <p className="text-gray-400 text-xs">Tempo rimasto</p>
            </div>
          </div>
        </div>

        {/* 2FA Form */}
        <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-400">⚠️</span>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Code Input */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-white mb-2">
                  Codice di Verifica
                </label>
                <div className="relative">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    required
                    value={code}
                    onChange={handleCodeChange}
                    className="block w-full px-4 py-4 text-center text-2xl font-mono border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">📱</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Inserisci il codice a 6 cifre dalla tua app di autenticazione
                </p>
              </div>

              {/* App Instructions */}
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-400 mt-0.5">📱</span>
                  <div className="text-sm text-gray-300">
                    <p className="font-medium mb-2">App di Autenticazione Supportate:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <span>•</span>
                        <span>Google Authenticator</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>•</span>
                        <span>Microsoft Authenticator</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>•</span>
                        <span>Authy</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>•</span>
                        <span>1Password</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span className="text-black">🔓</span>
                    )}
                  </span>
                  {loading ? 'Verifica in corso...' : 'Verifica e Accedi'}
                </button>
              </div>

              {/* Code Progress */}
              <div className="flex justify-center space-x-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i < code.length
                        ? 'bg-yellow-500'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-900 rounded-b-xl border-t border-gray-700">
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-400">
                Livello di sicurezza: <span className="text-yellow-400 font-semibold">MILITARE</span>
              </p>
              <div className="flex justify-center items-center space-x-4">
                <span className="text-xs text-green-400 flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>TOTP</span>
                </span>
                <span className="text-xs text-blue-400 flex items-center space-x-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>Encrypted</span>
                </span>
                <span className="text-xs text-purple-400 flex items-center space-x-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Zero Trust</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Backup Options */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-white mb-2">Problemi con l'autenticazione?</p>
            <div className="space-y-2">
              <button className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors">
                🔑 Usa codice di backup
              </button>
              <div className="text-gray-400 text-xs">
                oppure
              </div>
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                ← Torna al login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}