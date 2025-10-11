'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface SetupResponse {
  success: boolean;
  secret?: string;
  qrCode?: string;
  backupCodes?: string[];
  message?: string;
}

interface VerifyResponse {
  success: boolean;
  backupCodes?: string[];
  message?: string;
}

export default function TwoFactorSetup() {
  const [step, setStep] = useState<'generate' | 'verify' | 'complete'>('generate');
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    generateSecret();
  }, []);

  const generateSecret = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/2fa/setup-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: SetupResponse = await response.json();

      if (data.success && data.secret && data.qrCode) {
        setSecret(data.secret);
        setQrCode(data.qrCode);
        setStep('verify');
      } else {
        setError(data.message || 'Errore durante la generazione del secret');
      }
    } catch (error) {
      console.error('2FA setup error:', error);
      setError('Errore di connessione. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const verifySetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/2fa/verify-setup-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          secret,
          code: verificationCode 
        }),
      });

      const data: VerifyResponse = await response.json();

      if (data.success && data.backupCodes) {
        setBackupCodes(data.backupCodes);
        setStep('complete');
      } else {
        setError(data.message || 'Codice non valido');
        setVerificationCode('');
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      setError('Errore di verifica. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setVerificationCode(value);
  };

  const downloadBackupCodes = () => {
    const content = `Portfolio Admin - Codici di Backup 2FA
Generati il: ${new Date().toLocaleString('it-IT')}

IMPORTANTE: Conserva questi codici in un luogo sicuro!
Ogni codice può essere utilizzato una sola volta.

${backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

⚠️  ATTENZIONE:
- Conserva questi codici offline in un luogo sicuro
- Ogni codice funziona una sola volta
- Usa questi codici solo se non puoi accedere alla tua app di autenticazione
- Non condividere mai questi codici con nessuno`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-codes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">🔐</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Configurazione 2FA</h2>
          <p className="mt-2 text-sm text-gray-400">
            Aumenta la sicurezza del tuo account con l'autenticazione a due fattori
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center space-x-2 ${step === 'generate' ? 'text-yellow-400' : step === 'verify' || step === 'complete' ? 'text-green-400' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'generate' ? 'border-yellow-400 bg-yellow-400 text-black' : step === 'verify' || step === 'complete' ? 'border-green-400 bg-green-400 text-black' : 'border-gray-500'}`}>
              {step === 'verify' || step === 'complete' ? '✓' : '1'}
            </div>
            <span className="text-sm font-medium">Genera</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-600"></div>
          <div className={`flex items-center space-x-2 ${step === 'verify' ? 'text-yellow-400' : step === 'complete' ? 'text-green-400' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'verify' ? 'border-yellow-400 bg-yellow-400 text-black' : step === 'complete' ? 'border-green-400 bg-green-400 text-black' : 'border-gray-500'}`}>
              {step === 'complete' ? '✓' : '2'}
            </div>
            <span className="text-sm font-medium">Verifica</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-600"></div>
          <div className={`flex items-center space-x-2 ${step === 'complete' ? 'text-green-400' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'complete' ? 'border-green-400 bg-green-400 text-black' : 'border-gray-500'}`}>
              {step === 'complete' ? '✓' : '3'}
            </div>
            <span className="text-sm font-medium">Completa</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
          {/* Step 1: Generate (Loading) */}
          {step === 'generate' && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-2">Generazione Codice Sicuro</h3>
              <p className="text-gray-400">Creazione del tuo secret 2FA personalizzato...</p>
            </div>
          )}

          {/* Step 2: Verify */}
          {step === 'verify' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Scansiona il Codice QR</h3>
                <p className="text-gray-400">Usa la tua app di autenticazione per scansionare il codice</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* QR Code */}
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg inline-block mb-4">
                    {qrCode && (
                      <Image
                        src={qrCode}
                        alt="QR Code per 2FA"
                        width={200}
                        height={200}
                        className="mx-auto"
                      />
                    )}
                  </div>
                  
                  {/* Manual Entry */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <p className="text-sm font-medium text-white mb-2">
                      Non riesci a scansionare? Inserisci manualmente:
                    </p>
                    <div className="flex items-center space-x-2">
                      <code className="bg-gray-800 px-3 py-2 rounded text-yellow-400 text-sm font-mono flex-1 break-all">
                        {secret}
                      </code>
                      <button
                        onClick={() => copyToClipboard(secret, 'secret')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition"
                      >
                        {copied === 'secret' ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Verification Form */}
                <div>
                  <form onSubmit={verifySetup} className="space-y-6">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-400">⚠️</span>
                          <p className="text-red-400 text-sm">{error}</p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Codice di Verifica
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                        value={verificationCode}
                        onChange={handleCodeChange}
                        className="block w-full px-4 py-4 text-center text-2xl font-mono border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                      />
                      <p className="mt-2 text-xs text-gray-400">
                        Inserisci il codice a 6 cifre dalla tua app
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || verificationCode.length !== 6}
                      className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        'Verifica e Attiva 2FA'
                      )}
                    </button>

                    {/* Code Progress */}
                    <div className="flex justify-center space-x-2">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full transition-all ${
                            i < verificationCode.length
                              ? 'bg-green-500'
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </form>

                  {/* App Suggestions */}
                  <div className="mt-6 bg-gray-900 rounded-lg p-4">
                    <p className="text-sm font-medium text-white mb-3">App Consigliate:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <span>📱</span>
                        <span>Google Authenticator</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <span>🔐</span>
                        <span>Microsoft Authenticator</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <span>⚡</span>
                        <span>Authy</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <span>🔑</span>
                        <span>1Password</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {step === 'complete' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">2FA Configurato con Successo!</h3>
                <p className="text-gray-400">Il tuo account è ora protetto con autenticazione a due fattori</p>
              </div>

              {/* Backup Codes */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-6">
                <div className="flex items-start space-x-3 mb-4">
                  <span className="text-yellow-400 text-xl">⚠️</span>
                  <div>
                    <h4 className="text-yellow-400 font-bold text-lg mb-2">Codici di Backup Importanti</h4>
                    <p className="text-yellow-300 text-sm mb-4">
                      Salva questi codici in un luogo sicuro! Puoi usarli per accedere se perdi l'accesso alla tua app di autenticazione.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="bg-gray-900 rounded p-3 flex items-center justify-between">
                      <code className="text-yellow-400 font-mono text-sm">{code}</code>
                      <button
                        onClick={() => copyToClipboard(code, `backup-${index}`)}
                        className="text-gray-400 hover:text-white transition"
                      >
                        {copied === `backup-${index}` ? '✓' : '📋'}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={downloadBackupCodes}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded font-medium transition"
                  >
                    💾 Scarica Codici
                  </button>
                  <button
                    onClick={() => copyToClipboard(backupCodes.join('\n'), 'all-codes')}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium transition"
                  >
                    {copied === 'all-codes' ? '✓ Copiato' : '📋 Copia Tutti'}
                  </button>
                </div>
              </div>

              {/* Security Summary */}
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <h4 className="text-white font-bold text-lg mb-4">Riepilogo Sicurezza</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✅</span>
                    <span className="text-gray-300">Autenticazione a due fattori attivata</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✅</span>
                    <span className="text-gray-300">10 codici di backup generati</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✅</span>
                    <span className="text-gray-300">TOTP configurato correttamente</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✅</span>
                    <span className="text-gray-300">Livello di sicurezza: MILITARE</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Link
                  href="/admin"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center px-6 py-3 rounded-lg font-medium transition"
                >
                  🚀 Vai al Pannello Admin
                </Link>
                <Link
                  href="/login"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  🔐 Testa Login
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← Torna al Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}