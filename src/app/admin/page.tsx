'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wrench, 
  TrendingUp, 
  Eye, 
  Shield, 
  AlertTriangle, 
  Info, 
  FileText, 
  Plus, 
  BarChart3, 
  Lock, 
  Settings,
  Zap,
  CheckCircle,
  User,
  PieChart,
  Activity,
  Star,
  Archive,
  Target,
  ArrowLeft
} from 'lucide-react';
import ProjectAnalytics from '@/components/admin/ProjectAnalytics';

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

interface ProjectSummary {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  draftProjects: number;
  archivedProjects: number;
  inDevelopmentProjects: number;
  featuredProjects: number;
  completionRate: number;
  featuredRate: number;
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
  const [projectSummary, setProjectSummary] = useState<ProjectSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'activity'>('overview');
  const router = useRouter();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Carica dati reali dei progetti dalle analytics
      const analyticsResponse = await fetch('/api/analytics/projects');
      let projectData: ProjectSummary | null = null;
      
      if (analyticsResponse.ok) {
        const analytics = await analyticsResponse.json();
        projectData = analytics.summary;
        setProjectSummary(projectData);
        
        // Aggiorna le stats con i dati reali dei progetti
        setStats(prevStats => ({
          ...prevStats,
          totalProjects: projectData?.totalProjects || 0,
          activeProjects: projectData?.activeProjects || 0,
          completedProjects: projectData?.completedProjects || 0
        }));

        // Genera attività recenti basate sui progetti reali
        const recentProjectActivities = analytics.timeline.recentProjects.slice(0, 2).map((project: any, index: number) => ({
          id: `project-${project.id}`,
          type: 'project_created' as const,
          message: `Progetto "${project.title}" creato`,
          timestamp: project.createdAt,
          severity: 'info' as const
        }));

        setRecentActivity([
          ...recentProjectActivities,
          {
            id: '2',
            type: 'login',
            message: 'Login amministratore completato con successo',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            severity: 'info'
          },
          {
            id: '3',
            type: 'security_event',
            message: 'Sistema di sicurezza attivo e monitoraggio abilitato',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            severity: 'info'
          }
        ]);
        
      } else {
        console.warn('Failed to load project analytics, using default data');
        // Fallback ai dati di default
        setStats({
          totalProjects: 0,
          activeProjects: 0,
          completedProjects: 0,
          totalViews: 0,
          securityEvents: 0,
          loginAttempts: 0
        });
        
        setRecentActivity([
          {
            id: '1',
            type: 'login',
            message: 'Sistema dashboard inizializzato',
            timestamp: new Date().toISOString(),
            severity: 'info'
          }
        ]);
      }

      // Simula altri dati di sistema
      setStats(prevStats => ({
        ...prevStats,
        totalViews: 1547 + Math.floor(Math.random() * 100),
        securityEvents: Math.floor(Math.random() * 5),
        loginAttempts: 15 + Math.floor(Math.random() * 10)
      }));

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalViews: 0,
        securityEvents: 0,
        loginAttempts: 0
      });
      setLoading(false);
    }
  };

  // Funzioni per le azioni rapide
  const handleNewProject = () => {
    console.log('Navigating to projects page...');
    router.push('/admin/projects');
  };

  const handleGenerateReport = async () => {
    try {
      // Mostra loading state
      const originalText = document.querySelector('[data-report-button]')?.textContent;
      const button = document.querySelector('[data-report-button]') as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generando...';
      }

      // Simula chiamata API per generare report
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Crea e scarica un report JSON di esempio
      const reportData = {
        generated_at: new Date().toISOString(),
        summary: {
          total_projects: stats.totalProjects,
          active_projects: stats.activeProjects,
          completed_projects: stats.completedProjects,
          completion_rate: projectSummary?.completionRate || 0,
          featured_projects: projectSummary?.featuredProjects || 0
        },
        system_stats: {
          total_views: stats.totalViews,
          security_events: stats.securityEvents,
          login_attempts: stats.loginAttempts
        },
        generated_by: 'Portfolio Admin Dashboard',
        version: '1.0.0'
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Ripristina il pulsante
      if (button && originalText) {
        button.disabled = false;
        button.innerHTML = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>Genera Report';
      }

    } catch (error) {
      console.error('Error generating report:', error);
      alert('Errore durante la generazione del report');
    }
  };

  const handleSecurityCheck = () => {
    router.push('/admin/security');
  };

  const handleSettings = () => {
    router.push('/admin/settings');
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
      case 'danger': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project_created': return <Plus className="w-4 h-4" />;
      case 'project_updated': return <FileText className="w-4 h-4" />;
      case 'login': return <Lock className="w-4 h-4" />;
      case 'security_event': return <Shield className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Dashboard Amministratore
          </h1>
          <p className="text-gray-400">Panoramica completa del sistema e analytics approfondite</p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors transform hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Torna al Frontend</span>
          <span className="sm:hidden">Frontend</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-yellow-400 border-b-2 border-yellow-500 bg-gray-700/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Panoramica
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'text-yellow-400 border-b-2 border-yellow-500 bg-gray-700/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
            }`}
          >
            <PieChart className="w-5 h-5" />
            Analytics Progetti
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'activity'
                ? 'text-yellow-400 border-b-2 border-yellow-500 bg-gray-700/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
            }`}
          >
            <Activity className="w-5 h-5" />
            Attività Sistema
          </button>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Sezione Progetti */}
              <div className="bg-gray-900/50 rounded-xl border border-gray-600 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-yellow-500" />
                  Panoramica Progetti
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {/* Total Projects */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-2xl font-bold text-white">{stats.totalProjects}</span>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Progetti Totali</p>
                    <p className="text-xs text-blue-400 mt-1">Portfolio completo</p>
                  </div>

                  {/* Active Projects */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-yellow-400" />
                      </div>
                      <span className="text-2xl font-bold text-yellow-400">{stats.activeProjects}</span>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">In Corso</p>
                    <p className="text-xs text-yellow-400 mt-1">
                      {projectSummary?.inDevelopmentProjects || 0} in sviluppo
                    </p>
                  </div>

                  {/* Completed Projects */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="text-2xl font-bold text-green-400">{stats.completedProjects}</span>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Completati</p>
                    <p className="text-xs text-green-400 mt-1">
                      {projectSummary?.completionRate || 0}% completamento
                    </p>
                  </div>

                  {/* Featured Projects */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="text-2xl font-bold text-purple-400">{projectSummary?.featuredProjects || 0}</span>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">In Evidenza</p>
                    <p className="text-xs text-purple-400 mt-1">
                      {projectSummary?.featuredRate || 0}% del portfolio
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Progresso Portfolio</span>
                    <span className="text-sm font-bold text-white">{projectSummary?.completionRate || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500 ease-out"
                      style={{ width: `${projectSummary?.completionRate || 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>{projectSummary?.draftProjects || 0} bozze</span>
                    <span>{projectSummary?.archivedProjects || 0} archiviati</span>
                  </div>
                </div>
              </div>

              {/* Stats Sistema */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Views */}
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Visualizzazioni</p>
                      <p className="text-3xl font-bold text-purple-500">{stats.totalViews.toLocaleString()}</p>
                      <p className="text-xs text-purple-400 mt-1">Portfolio views</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </div>

                {/* Security Events */}
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Sicurezza</p>
                      <p className="text-3xl font-bold text-red-500">{stats.securityEvents}</p>
                      <p className="text-xs text-red-400 mt-1">Eventi rilevati</p>
                    </div>
                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                </div>

                {/* Login Attempts */}
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Accessi</p>
                      <p className="text-3xl font-bold text-orange-500">{stats.loginAttempts}</p>
                      <p className="text-xs text-orange-400 mt-1">Tentativi login</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-900/50 rounded-xl border border-gray-600 p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-yellow-500" />
                  Azioni Rapide
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button 
                    onClick={handleNewProject}
                    className="flex items-center justify-center space-x-2 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Nuovo Progetto</span>
                  </button>
                  <button 
                    onClick={handleGenerateReport}
                    data-report-button
                    className="flex items-center justify-center space-x-2 p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span className="font-medium">Genera Report</span>
                  </button>
                  <button 
                    onClick={handleSecurityCheck}
                    className="flex items-center justify-center space-x-2 p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors transform hover:scale-105"
                  >
                    <Lock className="w-5 h-5" />
                    <span className="font-medium">Controllo Sicurezza</span>
                  </button>
                  <button 
                    onClick={handleSettings}
                    className="flex items-center justify-center space-x-2 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors transform hover:scale-105"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Impostazioni</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <ProjectAnalytics />
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-yellow-500" />
                Attività Recente
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg border border-gray-600">
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
          )}
        </div>
      </div>
    </div>
  );
}