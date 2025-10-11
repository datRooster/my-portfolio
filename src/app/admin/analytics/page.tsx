'use client';

import { useState, useEffect } from 'react';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

interface ChartData {
  time: string;
  value: number;
}

export default function Analytics() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('visitors');
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      // Simula dati analytics per ora
      const mockMetrics: SystemMetric[] = [
        {
          name: 'Visitatori Totali',
          value: 12547,
          unit: 'visitatori',
          status: 'good',
          trend: 'up',
          icon: '👥'
        },
        {
          name: 'Visualizzazioni Pagina',
          value: 34521,
          unit: 'views',
          status: 'good',
          trend: 'up',
          icon: '👁️'
        },
        {
          name: 'Tempo Medio Sessione',
          value: 245,
          unit: 'secondi',
          status: 'good',
          trend: 'stable',
          icon: '⏱️'
        },
        {
          name: 'Frequenza di Rimbalzo',
          value: 34.5,
          unit: '%',
          status: 'warning',
          trend: 'down',
          icon: '📉'
        },
        {
          name: 'Progetti Visualizzati',
          value: 8943,
          unit: 'views',
          status: 'good',
          trend: 'up',
          icon: '🛠️'
        },
        {
          name: 'Download CV',
          value: 156,
          unit: 'downloads',
          status: 'good',
          trend: 'up',
          icon: '📄'
        },
        {
          name: 'Contatti Ricevuti',
          value: 89,
          unit: 'messaggi',
          status: 'good',
          trend: 'up',
          icon: '📧'
        },
        {
          name: 'Tempo Risposta API',
          value: 120,
          unit: 'ms',
          status: 'good',
          trend: 'stable',
          icon: '⚡'
        },
        {
          name: 'Utilizzo Database',
          value: 67.8,
          unit: '%',
          status: 'warning',
          trend: 'up',
          icon: '💾'
        },
        {
          name: 'Errori Sistema',
          value: 3,
          unit: 'errori/h',
          status: 'critical',
          trend: 'up',
          icon: '🚨'
        }
      ];

      // Genera dati per il grafico
      const mockChartData: ChartData[] = [];
      const now = new Date();
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        mockChartData.push({
          time: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 500) + 200
        });
      }

      setSystemMetrics(mockMetrics);
      setChartData(mockChartData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const formatNumber = (num: number, unit: string) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M ${unit}`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K ${unit}`;
    }
    return `${num} ${unit}`;
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
          <h1 className="text-3xl font-bold text-white mb-2">Analytics & Metriche</h1>
          <p className="text-gray-400">Panoramica completa delle performance del portfolio</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="24h">Ultime 24 ore</option>
            <option value="7d">Ultimi 7 giorni</option>
            <option value="30d">Ultimi 30 giorni</option>
            <option value="90d">Ultimi 90 giorni</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {systemMetrics.slice(0, 5).map((metric, index) => (
          <div key={index} className={`rounded-xl p-6 border-2 ${getStatusColor(metric.status)}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-2xl">{metric.icon}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm">{getTrendIcon(metric.trend)}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{metric.name}</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(metric.value, metric.unit)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Andamento Temporale</h2>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
            >
              <option value="visitors">Visitatori</option>
              <option value="pageviews">Visualizzazioni</option>
              <option value="projects">Progetti</option>
              <option value="contacts">Contatti</option>
            </select>
          </div>
        </div>
        <div className="p-6">
          {/* Grafico Semplificato */}
          <div className="h-64 bg-gray-900 rounded-lg p-4 flex items-end justify-between">
            {chartData.slice(-7).map((data, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div
                  className="bg-yellow-500 rounded-t w-8 transition-all duration-500"
                  style={{
                    height: `${(data.value / Math.max(...chartData.map(d => d.value))) * 200}px`
                  }}
                ></div>
                <div className="text-xs text-gray-400 transform -rotate-45">
                  {new Date(data.time).toLocaleDateString('it-IT', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Performance */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Performance Sistema</h2>
          </div>
          <div className="p-6 space-y-4">
            {systemMetrics.slice(5, 10).map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{metric.icon}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{metric.name}</p>
                    <p className="text-gray-400 text-sm">
                      {formatNumber(metric.value, metric.unit)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{getTrendIcon(metric.trend)}</span>
                  <div className={`w-3 h-3 rounded-full ${
                    metric.status === 'good' ? 'bg-green-500' :
                    metric.status === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Pagine Più Visitate</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { page: '/progetti', views: 4567, percentage: 35 },
              { page: '/', views: 3421, percentage: 26 },
              { page: '/progetti/e-commerce-platform', views: 2198, percentage: 17 },
              { page: '/contatti', views: 1456, percentage: 11 },
              { page: '/progetti/portfolio-website', views: 987, percentage: 8 },
              { page: '/about', views: 432, percentage: 3 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div className="flex-1">
                  <p className="text-white font-medium">{item.page}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-400 min-w-0">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-white font-bold">{item.views.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic Data */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Distribuzione Geografica</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { country: '🇮🇹 Italia', visitors: 5678, percentage: 45 },
              { country: '🇺🇸 Stati Uniti', visitors: 2543, percentage: 20 },
              { country: '🇬🇧 Regno Unito', visitors: 1876, percentage: 15 },
              { country: '🇩🇪 Germania', visitors: 1234, percentage: 10 },
              { country: '🇫🇷 Francia', visitors: 876, percentage: 7 },
              { country: '🇪🇸 Spagna', visitors: 456, percentage: 3 }
            ].map((item, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">{item.country}</span>
                  <span className="text-gray-400 text-sm">{item.percentage}%</span>
                </div>
                <div className="bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <p className="text-white font-bold">{item.visitors.toLocaleString()}</p>
                <p className="text-gray-400 text-xs">visitatori</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Azioni Analytics</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center space-x-2 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
              <span>📊</span>
              <span className="font-medium">Report Dettagliato</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 bg-green-600 hover:bg-green-700 rounded-lg transition">
              <span>📈</span>
              <span className="font-medium">Analisi Trend</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition">
              <span>🎯</span>
              <span className="font-medium">Obiettivi</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition">
              <span>📧</span>
              <span className="font-medium">Report Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}