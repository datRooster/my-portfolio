'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Target,
  Zap,
  CheckCircle,
  FileText,
  Archive,
  Settings,
  Star,
  Users,
  Code,
  Wrench
} from 'lucide-react';

interface ProjectAnalyticsData {
  summary: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    draftProjects: number;
    archivedProjects: number;
    inDevelopmentProjects: number;
    featuredProjects: number;
    completionRate: number;
    featuredRate: number;
    avgProjectsPerCategory: number;
  };
  distribution: {
    byCategory: Array<{
      id: string;
      name: string;
      color: string | null;
      icon: string | null;
      count: number;
      percentage: number;
    }>;
    byPriority: Array<{
      priority: number;
      count: number;
      percentage: number;
    }>;
    byStatus: Array<{
      status: string;
      count: number;
      label: string;
      percentage: number;
    }>;
  };
  topTechnologies: Array<{
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    projectCount: number;
    percentage: number;
  }>;
  topSkills: Array<{
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    projectCount: number;
    percentage: number;
  }>;
  timeline: {
    monthlyDistribution: Record<string, number>;
    recentProjects: Array<{
      id: string;
      title: string;
      status: string;
      priority: number;
      featured: boolean;
      createdAt: string;
      updatedAt: string;
      category: {
        name: string;
        color: string | null;
      };
    }>;
  };
}

interface ProjectAnalyticsProps {
  className?: string;
}

export default function ProjectAnalytics({ className = '' }: ProjectAnalyticsProps) {
  const [data, setData] = useState<ProjectAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/projects');
      if (!response.ok) {
        throw new Error('Failed to load analytics');
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Errore nel caricamento delle statistiche');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return <Zap className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'DRAFT': return <FileText className="w-4 h-4" />;
      case 'ARCHIVED': return <Archive className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'text-blue-400 bg-blue-500/20';
      case 'COMPLETED': return 'text-green-400 bg-green-500/20';
      case 'DRAFT': return 'text-gray-400 bg-gray-500/20';
      case 'ARCHIVED': return 'text-orange-400 bg-orange-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-red-400 bg-red-500/20';
    if (priority >= 6) return 'text-orange-400 bg-orange-500/20';
    if (priority >= 4) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-green-400 bg-green-500/20';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 8) return 'Critica';
    if (priority >= 6) return 'Alta';
    if (priority >= 4) return 'Media';
    return 'Bassa';
  };

  if (loading) {
    return (
      <div className={`bg-gray-800 rounded-xl border border-gray-700 p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mr-4"></div>
          <span className="text-gray-300">Caricamento analytics...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`bg-gray-800 rounded-xl border border-gray-700 p-8 ${className}`}>
        <div className="text-center">
          <div className="text-red-400 mb-4">⚠️ {error}</div>
          <button
            onClick={handleRefresh}
            className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con azioni */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-yellow-500" />
            Analytics Progetti
          </h2>
          <p className="text-gray-400 mt-1">Analisi dettagliata del portfolio</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Aggiorna
          </button>
          <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors">
            <Download className="w-4 h-4" />
            Esporta
          </button>
        </div>
      </div>

      {/* Statistiche principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Progetti Totali</p>
              <p className="text-3xl font-bold text-white">{data.summary.totalProjects}</p>
              <p className="text-xs text-gray-500 mt-1">
                Media {data.summary.avgProjectsPerCategory} per categoria
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Tasso Completamento</p>
              <p className="text-3xl font-bold text-green-400">{data.summary.completionRate}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {data.summary.completedProjects} su {data.summary.totalProjects}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Progetti in Evidenza</p>
              <p className="text-3xl font-bold text-yellow-400">{data.summary.featuredProjects}</p>
              <p className="text-xs text-gray-500 mt-1">
                {data.summary.featuredRate}% del totale
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Progetti Attivi</p>
              <p className="text-3xl font-bold text-blue-400">{data.summary.activeProjects}</p>
              <p className="text-xs text-gray-500 mt-1">
                + {data.summary.inDevelopmentProjects} in sviluppo
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Grafici distribuzione */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuzione per stato */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-yellow-500" />
            Distribuzione per Stato
          </h3>
          <div className="space-y-3">
            {data.distribution.byStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-gray-400 text-sm">{item.count} progetti</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{item.percentage}%</p>
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribuzione per priorità */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-500" />
            Distribuzione per Priorità
          </h3>
          <div className="space-y-3">
            {data.distribution.byPriority.map((item) => (
              <div key={item.priority} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getPriorityColor(item.priority)}`}>
                    <span className="text-sm font-bold">{item.priority}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Priorità {getPriorityLabel(item.priority)}</p>
                    <p className="text-gray-400 text-sm">{item.count} progetti</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{item.percentage}%</p>
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top tecnologie e competenze */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top tecnologie */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-yellow-500" />
            Top Tecnologie
          </h3>
          <div className="space-y-3">
            {data.topTechnologies.slice(0, 5).map((tech, index) => (
              <div key={tech.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{tech.name}</p>
                    <p className="text-gray-400 text-sm">{tech.projectCount} progetti</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{tech.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top competenze */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-yellow-500" />
            Top Competenze
          </h3>
          <div className="space-y-3">
            {data.topSkills.slice(0, 5).map((skill, index) => (
              <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{skill.name}</p>
                    <p className="text-gray-400 text-sm">{skill.projectCount} progetti</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{skill.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progetti recenti */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-yellow-500" />
          Progetti Recenti (Ultimi 30 giorni)
        </h3>
        <div className="space-y-3">
          {data.timeline.recentProjects.slice(0, 8).map((project) => (
            <div key={project.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${getStatusColor(project.status)}`}>
                  {getStatusIcon(project.status)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{project.title}</p>
                    {project.featured && (
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{project.category.name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                  <span>P{project.priority}</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(project.createdAt).toLocaleDateString('it-IT')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}