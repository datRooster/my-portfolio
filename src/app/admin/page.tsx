'use client';

import { useState, useEffect } from 'react';

interface Stats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalViews: number;
  securityEvents: number;
  loginAttempts: number;
}

interface RecentActivity {
  id: string;
  type: 'project_created' | 'project_updated' | 'login' | 'security_event';
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'danger';
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalViews: 0,
    securityEvents: 0,
    loginAttempts: 0
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simula dati per ora - in futuro collegherai alle API reali
      setStats({
        totalProjects: 12,
        activeProjects: 4,
        completedProjects: 8,
        totalViews: 1547,
        securityEvents: 3,
        loginAttempts: 15
      });

      setRecentActivity([
        {
          id: '1',
          type: 'project_created',
          message: 'Nuovo progetto "E-commerce Platform" creato',
          timestamp: new Date().toISOString(),
          severity: 'info'
        },
        {
          id: '2',
          type: 'security_event',
          message: 'Tentativo di accesso sospetto bloccato da IP 192.168.1.100',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          severity: 'warning'
        },
        {
          id: '3',
          type: 'login',
          message: 'Login amministratore completato con successo',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          severity: 'info'
        },
        {
          id: '4',
          type: 'project_updated',
          message: 'Progetto "Portfolio Security" aggiornato',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          severity: 'info'
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'danger': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'danger': return '🚨';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project_created': return '✨';
      case 'project_updated': return '📝';
      case 'login': return '🔐';
      case 'security_event': return '🛡️';
      default: return '📄';
    }
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Amministratore</h1>
        <p className="text-gray-400">Panoramica completa del sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Projects */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Progetti Totali</p>
              <p className="text-3xl font-bold text-white">{stats.totalProjects}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🛠️</span>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Progetti Attivi</p>
              <p className="text-3xl font-bold text-yellow-500">{stats.activeProjects}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>

        {/* Completed Projects */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Progetti Completati</p>
              <p className="text-3xl font-bold text-green-500">{stats.completedProjects}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Visualizzazioni Totali</p>
              <p className="text-3xl font-bold text-purple-500">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👁️</span>
            </div>
          </div>
        </div>

        {/* Security Events */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Eventi Sicurezza</p>
              <p className="text-3xl font-bold text-red-500">{stats.securityEvents}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
          </div>
        </div>

        {/* Login Attempts */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Tentativi Login</p>
              <p className="text-3xl font-bold text-orange-500">{stats.loginAttempts}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Attività Recente</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-900 rounded-lg">
                <div className="flex-shrink-0">
                  <span className="text-xl">{getActivityIcon(activity.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${getSeverityColor(activity.severity)}`}>
                      {getSeverityIcon(activity.severity)}
                    </span>
                    <p className="text-sm font-medium text-white">{activity.message}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.timestamp).toLocaleString('it-IT')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Azioni Rapide</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center space-x-2 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
              <span>➕</span>
              <span className="font-medium">Nuovo Progetto</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 bg-green-600 hover:bg-green-700 rounded-lg transition">
              <span>📊</span>
              <span className="font-medium">Genera Report</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition">
              <span>🔒</span>
              <span className="font-medium">Controllo Sicurezza</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition">
              <span>⚙️</span>
              <span className="font-medium">Impostazioni</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}