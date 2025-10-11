'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

interface LoginResponse {
  success: boolean;
  requiresTwoFactor?: boolean;
  requires2FAChoice?: boolean;
  requires2FA?: boolean;
  tempToken?: string;
  message?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data: LoginResponse = await response.json();

      if (data.success) {
        if (data.requiresTwoFactor) {
          if (data.requires2FAChoice) {
            // Redirect to 2FA choice page
            router.push('/login/setup-choice');
          } else {
            // Redirect to 2FA verification
            router.push('/login/2fa');
          }
        } else {
          // Redirect to admin panel
          router.push('/admin');
        }
      } else {
        setError(data.message || 'Errore durante il login');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Errore di connessione. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-3xl font-bold text-white">Accesso Amministratore</h2>
          <p className="mt-2 text-sm text-gray-400">
            Sistema di autenticazione sicuro
          </p>
        </div>

        {/* Security Badge */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-yellow-400">🔒</span>
            </div>
            <div>
              <p className="text-yellow-400 font-semibold text-sm">Sicurezza Militare Attiva</p>
              <p className="text-gray-400 text-xs">
                Crittografia AES-256 • 2FA • Rate Limiting
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
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

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Amministratore
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">📧</span>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔑</span>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    placeholder="••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-400 mt-0.5">ℹ️</span>
                  <div className="text-sm text-gray-300">
                    <p className="font-medium mb-1">Credenziali Demo:</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Email: <span className="text-yellow-400">admin@example.com</span></li>
                      <li>• Password: <span className="text-yellow-400">admin123</span></li>
                      <li>• Codice 2FA: <span className="text-yellow-400">123456</span></li>
                      <li>• Sistema di sicurezza militare attivo</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Lock className="w-5 h-5 text-black" />
                    )}
                  </span>
                  {loading ? 'Autenticazione in corso...' : 'Accedi al Pannello'}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-900 rounded-b-xl border-t border-gray-700">
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Sistema protetto da crittografia end-to-end
              </p>
              <div className="flex justify-center items-center space-x-4 mt-2">
                <span className="text-xs text-green-400 flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>SSL Attivo</span>
                </span>
                <span className="text-xs text-blue-400 flex items-center space-x-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>2FA Ready</span>
                </span>
                <span className="text-xs text-purple-400 flex items-center space-x-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Encrypted</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Site */}
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