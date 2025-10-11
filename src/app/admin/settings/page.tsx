'use client';

import { useState, useEffect } from 'react';

interface SecurityConfig {
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  maxLoginAttempts: number;
  lockoutDuration: number;
  sessionTimeout: number;
  require2FA: boolean;
  allowedCountries: string[];
  blockedIPs: string[];
  rateLimitRequests: number;
  rateLimitWindow: number;
}

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  emailNotifications: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

export default function Settings() {
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    maxLoginAttempts: 5,
    lockoutDuration: 900, // 15 minuti
    sessionTimeout: 3600, // 1 ora
    require2FA: true,
    allowedCountries: ['IT', 'US', 'GB', 'DE', 'FR'],
    blockedIPs: ['192.168.100.1', '10.0.0.50'],
    rateLimitRequests: 100,
    rateLimitWindow: 900 // 15 minuti
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'My Portfolio',
    siteDescription: 'Portfolio professionale di sviluppo web',
    contactEmail: 'admin@myportfolio.com',
    maintenanceMode: false,
    allowRegistration: false,
    emailNotifications: true,
    backupFrequency: 'daily',
    logLevel: 'info'
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'security' | 'system' | 'notifications' | 'backup'>('security');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSecuritySave = async () => {
    setLoading(true);
    try {
      // Simula salvataggio configurazione sicurezza
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Configurazione sicurezza aggiornata con successo!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving security config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSave = async () => {
    setLoading(true);
    try {
      // Simula salvataggio impostazioni sistema
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Impostazioni sistema aggiornate con successo!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving system settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBlockedIP = (ip: string) => {
    if (ip && !securityConfig.blockedIPs.includes(ip)) {
      setSecurityConfig(prev => ({
        ...prev,
        blockedIPs: [...prev.blockedIPs, ip]
      }));
    }
  };

  const removeBlockedIP = (ip: string) => {
    setSecurityConfig(prev => ({
      ...prev,
      blockedIPs: prev.blockedIPs.filter(blockedIP => blockedIP !== ip)
    }));
  };

  const addAllowedCountry = (country: string) => {
    if (country && !securityConfig.allowedCountries.includes(country)) {
      setSecurityConfig(prev => ({
        ...prev,
        allowedCountries: [...prev.allowedCountries, country]
      }));
    }
  };

  const removeAllowedCountry = (country: string) => {
    setSecurityConfig(prev => ({
      ...prev,
      allowedCountries: prev.allowedCountries.filter(c => c !== country)
    }));
  };

  const handleBackup = async (type: 'manual' | 'database' | 'files') => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccessMessage(`Backup ${type} completato con successo!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error during backup:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Impostazioni Sistema</h1>
        <p className="text-gray-400">Configurazione sicurezza e sistema</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-green-400">✅</span>
            <p className="text-green-400 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-4 font-medium transition ${
              activeTab === 'security'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🛡️ Sicurezza
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-6 py-4 font-medium transition ${
              activeTab === 'system'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ⚙️ Sistema
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-4 font-medium transition ${
              activeTab === 'notifications'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📧 Notifiche
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-6 py-4 font-medium transition ${
              activeTab === 'backup'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            💾 Backup
          </button>
        </div>

        <div className="p-6">
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              {/* Password Policy */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Policy Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Lunghezza Minima Password
                    </label>
                    <input
                      type="number"
                      min={6}
                      max={32}
                      value={securityConfig.passwordMinLength}
                      onChange={(e) => setSecurityConfig(prev => ({
                        ...prev,
                        passwordMinLength: parseInt(e.target.value)
                      }))}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={securityConfig.passwordRequireUppercase}
                        onChange={(e) => setSecurityConfig(prev => ({
                          ...prev,
                          passwordRequireUppercase: e.target.checked
                        }))}
                        className="sr-only"
                      />
                      <div className={`relative w-6 h-6 rounded border-2 mr-3 ${
                        securityConfig.passwordRequireUppercase ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'
                      }`}>
                        {securityConfig.passwordRequireUppercase && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-black text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <span className="text-white">Richiedi lettere maiuscole</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={securityConfig.passwordRequireLowercase}
                        onChange={(e) => setSecurityConfig(prev => ({
                          ...prev,
                          passwordRequireLowercase: e.target.checked
                        }))}
                        className="sr-only"
                      />
                      <div className={`relative w-6 h-6 rounded border-2 mr-3 ${
                        securityConfig.passwordRequireLowercase ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'
                      }`}>
                        {securityConfig.passwordRequireLowercase && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-black text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <span className="text-white">Richiedi lettere minuscole</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={securityConfig.passwordRequireNumbers}
                        onChange={(e) => setSecurityConfig(prev => ({
                          ...prev,
                          passwordRequireNumbers: e.target.checked
                        }))}
                        className="sr-only"
                      />
                      <div className={`relative w-6 h-6 rounded border-2 mr-3 ${
                        securityConfig.passwordRequireNumbers ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'
                      }`}>
                        {securityConfig.passwordRequireNumbers && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-black text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <span className="text-white">Richiedi numeri</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={securityConfig.passwordRequireSymbols}
                        onChange={(e) => setSecurityConfig(prev => ({
                          ...prev,
                          passwordRequireSymbols: e.target.checked
                        }))}
                        className="sr-only"
                      />
                      <div className={`relative w-6 h-6 rounded border-2 mr-3 ${
                        securityConfig.passwordRequireSymbols ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'
                      }`}>
                        {securityConfig.passwordRequireSymbols && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-black text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <span className="text-white">Richiedi simboli</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Login Security */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Sicurezza Login</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Max Tentativi Login
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={securityConfig.maxLoginAttempts}
                      onChange={(e) => setSecurityConfig(prev => ({
                        ...prev,
                        maxLoginAttempts: parseInt(e.target.value)
                      }))}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Durata Blocco (secondi)
                    </label>
                    <input
                      type="number"
                      min={60}
                      max={3600}
                      value={securityConfig.lockoutDuration}
                      onChange={(e) => setSecurityConfig(prev => ({
                        ...prev,
                        lockoutDuration: parseInt(e.target.value)
                      }))}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Timeout Sessione (secondi)
                    </label>
                    <input
                      type="number"
                      min={300}
                      max={7200}
                      value={securityConfig.sessionTimeout}
                      onChange={(e) => setSecurityConfig(prev => ({
                        ...prev,
                        sessionTimeout: parseInt(e.target.value)
                      }))}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={securityConfig.require2FA}
                      onChange={(e) => setSecurityConfig(prev => ({
                        ...prev,
                        require2FA: e.target.checked
                      }))}
                      className="sr-only"
                    />
                    <div className={`relative w-6 h-6 rounded border-2 mr-3 ${
                      securityConfig.require2FA ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'
                    }`}>
                      {securityConfig.require2FA && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-black text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <span className="text-white font-medium">Richiedi Autenticazione a Due Fattori (2FA)</span>
                  </label>
                </div>
              </div>

              {/* Rate Limiting */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Rate Limiting</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Max Richieste per Finestra
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={1000}
                      value={securityConfig.rateLimitRequests}
                      onChange={(e) => setSecurityConfig(prev => ({
                        ...prev,
                        rateLimitRequests: parseInt(e.target.value)
                      }))}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Finestra Temporale (secondi)
                    </label>
                    <input
                      type="number"
                      min={60}
                      max={3600}
                      value={securityConfig.rateLimitWindow}
                      onChange={(e) => setSecurityConfig(prev => ({
                        ...prev,
                        rateLimitWindow: parseInt(e.target.value)
                      }))}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>
              </div>

              {/* IP Management */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Gestione IP</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      IP Bloccati
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Aggiungi IP da bloccare"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addBlockedIP(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                        className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {securityConfig.blockedIPs.map((ip, index) => (
                        <span key={index} className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm flex items-center">
                          {ip}
                          <button
                            onClick={() => removeBlockedIP(ip)}
                            className="ml-2 text-red-300 hover:text-red-100"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Paesi Consentiti (ISO Code)
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Aggiungi codice paese (es. IT)"
                        maxLength={2}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addAllowedCountry(e.currentTarget.value.toUpperCase());
                            e.currentTarget.value = '';
                          }
                        }}
                        className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {securityConfig.allowedCountries.map((country, index) => (
                        <span key={index} className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm flex items-center">
                          {country}
                          <button
                            onClick={() => removeAllowedCountry(country)}
                            className="ml-2 text-green-300 hover:text-green-100"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSecuritySave}
                  disabled={loading}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salva Configurazione Sicurezza'}
                </button>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Impostazioni Generali</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Nome del Sito
                    </label>
                    <input
                      type="text"
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        siteName: e.target.value
                      }))}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Email di Contatto
                    </label>
                    <input
                      type="email"
                      value={systemSettings.contactEmail}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        contactEmail: e.target.value
                      }))}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-white mb-2">
                    Descrizione del Sito
                  </label>
                  <textarea
                    rows={3}
                    value={systemSettings.siteDescription}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      siteDescription: e.target.value
                    }))}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Configurazione Sistema</h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        maintenanceMode: e.target.checked
                      }))}
                      className="sr-only"
                    />
                    <div className={`relative w-6 h-6 rounded border-2 mr-3 ${
                      systemSettings.maintenanceMode ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'
                    }`}>
                      {systemSettings.maintenanceMode && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-black text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <span className="text-white font-medium">Modalità Manutenzione</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={systemSettings.allowRegistration}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        allowRegistration: e.target.checked
                      }))}
                      className="sr-only"
                    />
                    <div className={`relative w-6 h-6 rounded border-2 mr-3 ${
                      systemSettings.allowRegistration ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'
                    }`}>
                      {systemSettings.allowRegistration && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-black text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <span className="text-white font-medium">Consenti Registrazioni</span>
                  </label>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-white mb-2">
                    Livello di Log
                  </label>
                  <select
                    value={systemSettings.logLevel}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      logLevel: e.target.value as any
                    }))}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="error">Error (Solo errori)</option>
                    <option value="warn">Warning (Errori e avvisi)</option>
                    <option value="info">Info (Informazioni generali)</option>
                    <option value="debug">Debug (Tutti i dettagli)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSystemSave}
                  disabled={loading}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salva Impostazioni Sistema'}
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Preferenze Notifiche</h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={systemSettings.emailNotifications}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        emailNotifications: e.target.checked
                      }))}
                      className="sr-only"
                    />
                    <div className={`relative w-6 h-6 rounded border-2 mr-3 ${
                      systemSettings.emailNotifications ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'
                    }`}>
                      {systemSettings.emailNotifications && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-black text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <span className="text-white font-medium">Notifiche Email</span>
                  </label>
                </div>
              </div>

              <div className="text-center py-12">
                <p className="text-gray-400">Configurazione notifiche in sviluppo...</p>
              </div>
            </div>
          )}

          {/* Backup Tab */}
          {activeTab === 'backup' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Configurazione Backup</h3>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Frequenza Backup Automatico
                  </label>
                  <select
                    value={systemSettings.backupFrequency}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      backupFrequency: e.target.value as any
                    }))}
                    className="w-full md:w-auto bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="daily">Giornaliero</option>
                    <option value="weekly">Settimanale</option>
                    <option value="monthly">Mensile</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Backup Manuali</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleBackup('manual')}
                    disabled={loading}
                    className="flex flex-col items-center space-y-2 p-6 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                  >
                    <span className="text-2xl">💾</span>
                    <span className="font-medium">Backup Completo</span>
                    <span className="text-sm text-blue-200">Database + Files</span>
                  </button>

                  <button
                    onClick={() => handleBackup('database')}
                    disabled={loading}
                    className="flex flex-col items-center space-y-2 p-6 bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-50"
                  >
                    <span className="text-2xl">🗄️</span>
                    <span className="font-medium">Backup Database</span>
                    <span className="text-sm text-green-200">Solo dati</span>
                  </button>

                  <button
                    onClick={() => handleBackup('files')}
                    disabled={loading}
                    className="flex flex-col items-center space-y-2 p-6 bg-purple-600 hover:bg-purple-700 rounded-lg transition disabled:opacity-50"
                  >
                    <span className="text-2xl">📁</span>
                    <span className="font-medium">Backup Files</span>
                    <span className="text-sm text-purple-200">Solo file</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Ultimi Backup</h3>
                <div className="space-y-2">
                  {[
                    { type: 'Completo', date: '2024-01-15 02:00:00', size: '45.2 MB', status: 'success' },
                    { type: 'Database', date: '2024-01-14 14:30:00', size: '12.8 MB', status: 'success' },
                    { type: 'Files', date: '2024-01-14 10:15:00', size: '32.4 MB', status: 'success' },
                    { type: 'Completo', date: '2024-01-13 02:00:00', size: '44.9 MB', status: 'warning' }
                  ].map((backup, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">
                          {backup.status === 'success' ? '✅' : '⚠️'}
                        </span>
                        <div>
                          <p className="text-white font-medium">Backup {backup.type}</p>
                          <p className="text-gray-400 text-sm">{backup.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white">{backup.size}</p>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}