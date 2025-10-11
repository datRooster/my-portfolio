'use client';

import { useState, useEffect } from 'react';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | '2fa_setup' | 'password_change' | 'session_expired';
  message: string;
  ipAddress: string;
  userAgent: string;
  userId?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'investigating';
}

interface LoginAttempt {
  id: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  timestamp: string;
  failureReason?: string;
}

interface ActiveSession {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  lastActivity: string;
  createdAt: string;
  isCurrentSession: boolean;
}

interface SecurityStats {
  totalLoginAttempts: number;
  failedAttempts: number;
  successfulLogins: number;
  activeThreats: number;
  blockedIPs: number;
  activeSessions: number;
}

const severityColors = {
  low: 'text-green-400 bg-green-500/10',
  medium: 'text-yellow-400 bg-yellow-500/10',
  high: 'text-orange-400 bg-orange-500/10',
  critical: 'text-red-400 bg-red-500/10'
};

const severityIcons = {
  low: 'ℹ️',
  medium: '⚠️',
  high: '🚨',
  critical: '💀'
};

const eventTypeIcons = {
  login_attempt: '🔐',
  failed_login: '❌',
  suspicious_activity: '🕵️',
  '2fa_setup': '🔑',
  password_change: '🔒',
  session_expired: '⏰'
};

export default function SecurityMonitoring() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [securityStats, setSecurityStats] = useState<SecurityStats>({
    totalLoginAttempts: 0,
    failedAttempts: 0,
    successfulLogins: 0,
    activeThreats: 0,
    blockedIPs: 0,
    activeSessions: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'sessions' | 'attempts'>('events');
  const [timeFilter, setTimeFilter] = useState('24h');

  useEffect(() => {
    loadSecurityData();
  }, [timeFilter]);

  const loadSecurityData = async () => {
    try {
      // Simula dati di sicurezza per ora - in futuro collegherai alle API reali
      const mockSecurityEvents: SecurityEvent[] = [
        {
          id: '1',
          type: 'failed_login',
          message: 'Tentativo di login fallito per admin@example.com',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          timestamp: new Date().toISOString(),
          severity: 'medium',
          status: 'active'
        },
        {
          id: '2',
          type: 'suspicious_activity',
          message: 'Attività sospetta rilevata: Multiple richieste da IP singolo',
          ipAddress: '10.0.0.50',
          userAgent: 'Python-requests/2.28.1',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          severity: 'high',
          status: 'investigating'
        },
        {
          id: '3',
          type: 'login_attempt',
          message: 'Login amministratore completato con successo',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          userId: 'admin-1',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          severity: 'low',
          status: 'resolved'
        },
        {
          id: '4',
          type: '2fa_setup',
          message: 'Configurazione 2FA completata per utente admin@example.com',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          userId: 'admin-1',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          severity: 'low',
          status: 'resolved'
        },
        {
          id: '5',
          type: 'suspicious_activity',
          message: 'Tentativo di accesso da paese non autorizzato (RU)',
          ipAddress: '81.92.123.45',
          userAgent: 'curl/7.68.0',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          severity: 'critical',
          status: 'resolved'
        }
      ];

      const mockLoginAttempts: LoginAttempt[] = [
        {
          id: '1',
          email: 'admin@example.com',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          success: true,
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          email: 'admin@example.com',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          success: false,
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          failureReason: 'Password non corretta'
        },
        {
          id: '3',
          email: 'test@test.com',
          ipAddress: '10.0.0.50',
          userAgent: 'Python-requests/2.28.1',
          success: false,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          failureReason: 'Utente non trovato'
        }
      ];

      const mockActiveSessions: ActiveSession[] = [
        {
          id: 'session-1',
          userId: 'admin-1',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          lastActivity: new Date(Date.now() - 300000).toISOString(),
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          isCurrentSession: true
        },
        {
          id: 'session-2',
          userId: 'admin-1',
          ipAddress: '192.168.1.50',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
          lastActivity: new Date(Date.now() - 1800000).toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          isCurrentSession: false
        }
      ];

      setSecurityEvents(mockSecurityEvents);
      setLoginAttempts(mockLoginAttempts);
      setActiveSessions(mockActiveSessions);
      
      setSecurityStats({
        totalLoginAttempts: 45,
        failedAttempts: 12,
        successfulLogins: 33,
        activeThreats: 2,
        blockedIPs: 5,
        activeSessions: 2
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading security data:', error);
      setLoading(false);
    }
  };

  const handleResolveEvent = async (eventId: string) => {
    setSecurityEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, status: 'resolved' }
          : event
      )
    );
  };

  const handleTerminateSession = async (sessionId: string) => {
    if (!confirm('Sei sicuro di voler terminare questa sessione?')) return;
    
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const formatUserAgent = (userAgent: string) => {
    if (userAgent.includes('iPhone')) return '📱 iPhone';
    if (userAgent.includes('Android')) return '📱 Android';
    if (userAgent.includes('Macintosh')) return '💻 Mac';
    if (userAgent.includes('Windows')) return '💻 Windows';
    if (userAgent.includes('Linux')) return '🐧 Linux';
    if (userAgent.includes('curl')) return '🤖 Bot/API';
    if (userAgent.includes('Python')) return '🐍 Python Script';
    return '🌐 Browser';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Monitoraggio Sicurezza</h1>
          <p className="text-gray-400">Sistema di sicurezza a prova di guerra cibernetica</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="1h">Ultima ora</option>
            <option value="24h">Ultime 24 ore</option>
            <option value="7d">Ultimi 7 giorni</option>
            <option value="30d">Ultimi 30 giorni</option>
          </select>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tentativi Login</p>
              <p className="text-2xl font-bold text-white">{securityStats.totalLoginAttempts}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-xl">🔐</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Login Falliti</p>
              <p className="text-2xl font-bold text-red-500">{securityStats.failedAttempts}</p>
            </div>
            <div className="w-10 h-10 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-xl">❌</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Login Riusciti</p>
              <p className="text-2xl font-bold text-green-500">{securityStats.successfulLogins}</p>
            </div>
            <div className="w-10 h-10 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Minacce Attive</p>
              <p className="text-2xl font-bold text-orange-500">{securityStats.activeThreats}</p>
            </div>
            <div className="w-10 h-10 bg-orange-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-xl">🚨</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">IP Bloccati</p>
              <p className="text-2xl font-bold text-purple-500">{securityStats.blockedIPs}</p>
            </div>
            <div className="w-10 h-10 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-xl">🚫</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Sessioni Attive</p>
              <p className="text-2xl font-bold text-yellow-500">{securityStats.activeSessions}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-4 font-medium transition ${
              activeTab === 'events'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🛡️ Eventi di Sicurezza
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-6 py-4 font-medium transition ${
              activeTab === 'sessions'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            👥 Sessioni Attive
          </button>
          <button
            onClick={() => setActiveTab('attempts')}
            className={`px-6 py-4 font-medium transition ${
              activeTab === 'attempts'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🔐 Tentativi di Login
          </button>
        </div>

        <div className="p-6">
          {/* Security Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {securityEvents.map((event) => (
                <div key={event.id} className="bg-gray-900 rounded-lg p-4 border-l-4 border-l-gray-600">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">{eventTypeIcons[event.type]}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors[event.severity]}`}>
                            {severityIcons[event.severity]} {event.severity.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.status === 'resolved' ? 'bg-green-500/10 text-green-400' :
                            event.status === 'investigating' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {event.status === 'resolved' ? '✅ Risolto' :
                             event.status === 'investigating' ? '🔍 In indagine' :
                             '🚨 Attivo'}
                          </span>
                        </div>
                        <p className="text-white font-medium mb-2">{event.message}</p>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>📍 IP: {event.ipAddress}</p>
                          <p>🌐 {formatUserAgent(event.userAgent)}</p>
                          <p>⏰ {new Date(event.timestamp).toLocaleString('it-IT')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {event.status !== 'resolved' && (
                        <button
                          onClick={() => handleResolveEvent(event.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                        >
                          ✅ Risolvi
                        </button>
                      )}
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition">
                        👁️ Dettagli
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session.id} className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">👤</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {session.isCurrentSession && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                              🟢 Sessione Corrente
                            </span>
                          )}
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                            ID: {session.userId}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>📍 IP: {session.ipAddress}</p>
                          <p>🌐 {formatUserAgent(session.userAgent)}</p>
                          <p>⏰ Ultima attività: {new Date(session.lastActivity).toLocaleString('it-IT')}</p>
                          <p>🕐 Creata: {new Date(session.createdAt).toLocaleString('it-IT')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!session.isCurrentSession && (
                        <button
                          onClick={() => handleTerminateSession(session.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                        >
                          🚫 Termina
                        </button>
                      )}
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition">
                        📊 Dettagli
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Login Attempts Tab */}
          {activeTab === 'attempts' && (
            <div className="space-y-4">
              {loginAttempts.map((attempt) => (
                <div key={attempt.id} className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">{attempt.success ? '✅' : '❌'}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            attempt.success 
                              ? 'bg-green-500/10 text-green-400' 
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            {attempt.success ? '✅ SUCCESSO' : '❌ FALLITO'}
                          </span>
                          <span className="text-white font-medium">{attempt.email}</span>
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>📍 IP: {attempt.ipAddress}</p>
                          <p>🌐 {formatUserAgent(attempt.userAgent)}</p>
                          <p>⏰ {new Date(attempt.timestamp).toLocaleString('it-IT')}</p>
                          {attempt.failureReason && (
                            <p className="text-red-400">❌ Motivo: {attempt.failureReason}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition">
                        📊 Analizza
                      </button>
                      {!attempt.success && (
                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition">
                          🚫 Blocca IP
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Azioni di Sicurezza</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center space-x-2 p-4 bg-red-600 hover:bg-red-700 rounded-lg transition">
              <span>🚨</span>
              <span className="font-medium">Blocco Emergenza</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition">
              <span>🔄</span>
              <span className="font-medium">Reset 2FA</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
              <span>📊</span>
              <span className="font-medium">Report Sicurezza</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition">
              <span>⚙️</span>
              <span className="font-medium">Config Sicurezza</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}