'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Eye, 
  Globe, 
  Clock, 
  TrendingUp, 
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Calendar,
  MapPin,
  ExternalLink,
  Smartphone,
  Monitor,
  Activity
} from 'lucide-react';

interface VisitorAnalytics {
  overview: {
    totalVisitors: number;
    uniqueVisitors: number;
    pageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
    returningVisitors: number;
  };
  realTime: {
    currentOnline: number;
    todayVisitors: number;
    thisWeekVisitors: number;
    thisMonthVisitors: number;
  };
  traffic: {
    sources: Array<{
      source: string;
      visitors: number;
      percentage: number;
      sessions: number;
    }>;
    pages: Array<{
      page: string;
      views: number;
      uniqueViews: number;
      avgTime: number;
    }>;
  };
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  geographic: Array<{
    country: string;
    visitors: number;
    percentage: number;
  }>;
  timeline: Array<{
    date: string;
    visitors: number;
    pageViews: number;
    sessions: number;
  }>;
}

interface VisitorAnalyticsProps {
  className?: string;
}

export default function VisitorAnalytics({ className = '' }: VisitorAnalyticsProps) {
  const [data, setData] = useState<VisitorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(!data);
      setRefreshing(!!data);
      
      const response = await fetch(`/api/admin/visitor-analytics?timeRange=${timeRange}`);
      if (!response.ok) throw new Error('Failed to load visitor analytics');
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Errore nel caricamento delle analitiche visitatori');
      console.error('Visitor analytics error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadAnalytics();
  };

  const handleExport = () => {
    // TODO: Implementare export CSV/PDF
    console.log('Export analytics data');
  };

  if (loading) {
    return (
      <div className={`bg-gray-800 rounded-xl border border-gray-700 p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">Caricamento analytics visitatori...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`bg-gray-800 rounded-xl border border-gray-700 p-8 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Errore nel Caricamento</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-yellow-500 text-gray-900 font-medium rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Analytics Visitatori</h2>
          <p className="text-gray-400">Analisi dettagliata del traffico e comportamento utenti</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="24h">Ultime 24h</option>
            <option value="7d">Ultimi 7 giorni</option>
            <option value="30d">Ultimi 30 giorni</option>
            <option value="90d">Ultimi 90 giorni</option>
          </select>
          
          {/* Actions */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Aggiorna
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-medium rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Esporta
          </button>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Statistiche Real-Time
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Aggiornamento automatico
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {data.realTime.currentOnline}
            </div>
            <div className="text-sm text-gray-400">Online Ora</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {data.realTime.todayVisitors.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Oggi</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {data.realTime.thisWeekVisitors.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Questa Settimana</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {data.realTime.thisMonthVisitors.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Questo Mese</div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">
              {data.overview.totalVisitors.toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-gray-400 mb-2">Visitatori Totali</div>
          <div className="text-xs text-blue-400">
            {data.overview.uniqueVisitors.toLocaleString()} unici ({((data.overview.uniqueVisitors / data.overview.totalVisitors) * 100).toFixed(1)}%)
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <Eye className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">
              {data.overview.pageViews.toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-gray-400 mb-2">Visualizzazioni Pagina</div>
          <div className="text-xs text-green-400">
            {(data.overview.pageViews / data.overview.totalVisitors).toFixed(1)} pagine per visita
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">
              {Math.floor(data.overview.avgSessionDuration / 60)}m {data.overview.avgSessionDuration % 60}s
            </span>
          </div>
          <div className="text-sm text-gray-400 mb-2">Durata Media Sessione</div>
          <div className="text-xs text-yellow-400">
            Bounce Rate: {data.overview.bounceRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Traffic Sources & Popular Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Traffic Sources */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-blue-400" />
              Sorgenti di Traffico
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {data.traffic.sources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{source.source}</span>
                    <span className="text-gray-400 text-sm">{source.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                    <span>{source.visitors.toLocaleString()} visitatori</span>
                    <span>{source.sessions.toLocaleString()} sessioni</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Pages */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              Pagine Più Visitate
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {data.traffic.pages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div className="flex-1">
                  <div className="text-white font-medium mb-1">{page.page}</div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{page.views.toLocaleString()} visualizzazioni</span>
                    <span>{page.uniqueViews.toLocaleString()} uniche</span>
                    <span>{Math.floor(page.avgTime / 60)}m {page.avgTime % 60}s</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">#{index + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Types & Geographic Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Device Types */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-400" />
              Dispositivi
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Desktop</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(data.devices.desktop / (data.devices.desktop + data.devices.mobile + data.devices.tablet)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium w-16 text-right">
                    {data.devices.desktop.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-green-400" />
                  <span className="text-white">Mobile</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(data.devices.mobile / (data.devices.desktop + data.devices.mobile + data.devices.tablet)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium w-16 text-right">
                    {data.devices.mobile.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-orange-400" />
                  <span className="text-white">Tablet</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${(data.devices.tablet / (data.devices.desktop + data.devices.mobile + data.devices.tablet)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium w-16 text-right">
                    {data.devices.tablet.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Data */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-400" />
              Distribuzione Geografica
            </h3>
          </div>
          <div className="p-6 space-y-3">
            {data.geographic.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-white">{country.country}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${country.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-400 text-sm w-16 text-right">
                    {country.visitors.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-400" />
            Andamento Temporale
          </h3>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-end justify-between gap-2">
            {data.timeline.map((day, index) => {
              const maxVisitors = Math.max(...data.timeline.map(d => d.visitors));
              const height = (day.visitors / maxVisitors) * 200;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative group">
                    <div
                      className="bg-yellow-500 rounded-t transition-all duration-500 hover:bg-yellow-400 min-w-[20px]"
                      style={{ height: `${height}px` }}
                    ></div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs whitespace-nowrap shadow-xl">
                        <div className="text-white font-medium mb-1">
                          {new Date(day.date).toLocaleDateString('it-IT')}
                        </div>
                        <div className="text-gray-400">
                          {day.visitors} visitatori<br />
                          {day.pageViews} visualizzazioni<br />
                          {day.sessions} sessioni
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 transform -rotate-45 origin-center">
                    {new Date(day.date).toLocaleDateString('it-IT', { 
                      day: 'numeric',
                      month: 'short'
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}