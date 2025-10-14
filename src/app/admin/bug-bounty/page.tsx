'use client';

import { useState, useEffect } from 'react';
import { 
  Target, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  FileText,
  Trophy,
  BookOpen,
  Monitor,
  RefreshCw,
  Download,
  Upload,
  ExternalLink,
  Settings
} from 'lucide-react';

interface BugBountyStats {
  totalBugs: number;
  criticalBugs: number;
  highBugs: number;
  mediumBugs: number;
  lowBugs: number;
  informationalBugs: number;
  totalReward: number;
  totalBounty: number;
  avgRewardPerBug: number;
  cveAssigned: number;
  avgResolutionDays: number;
  fastestResolution: number;
}

interface BugReport {
  id: string;
  title: string;
  severity: string;
  program: string;
  reward: number | null;
  status: string;
  discoveredAt: string;
}

interface Platform {
  id: string;
  name: string;
  username: string;
  reputation: number;
  bugsSubmitted: number;
  totalEarnings: number;
  active: boolean;
}

interface Achievement {
  id: string;
  title: string;
  category: string;
  earnedAt: string;
  featured: boolean;
}

export default function AdminBugBountyPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<BugBountyStats | null>(null);
  const [recentReports, setRecentReports] = useState<BugReport[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load stats
      const statsResponse = await fetch('/api/bug-bounty/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load recent reports
      const reportsResponse = await fetch('/api/bug-bounty/reports?limit=10&sortBy=discoveredAt&sortOrder=desc');
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json();
        setRecentReports(reportsData.reports || []);
      }

      // Load platforms
      const platformsResponse = await fetch('/api/bug-bounty/platforms');
      if (platformsResponse.ok) {
        const platformsData = await platformsResponse.json();
        setPlatforms(platformsData.platforms || []);
      }

      // Load achievements
      const achievementsResponse = await fetch('/api/bug-bounty/achievements');
      if (achievementsResponse.ok) {
        const achievementsData = await achievementsResponse.json();
        setAchievements(achievementsData.achievements || []);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncPlatforms = async () => {
    setSyncing(true);
    try {
      // TODO: Implement platform sync API call
      await fetch('/api/bug-bounty/sync-platforms', { method: 'POST' });
      await loadDashboardData();
    } catch (error) {
      console.error('Error syncing platforms:', error);
    } finally {
      setSyncing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-purple-400';
      case 'high': return 'text-red-400';
      case 'medium': return 'text-orange-400';
      case 'low': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Caricamento Bug Bounty Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Bug Bounty Management</h1>
              <p className="text-gray-400">Gestisci reports, piattaforme e achievement</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSyncPlatforms}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Sincronizzando...' : 'Sync Platforms'}
            </button>
            <a
              href="/admin/bug-bounty/settings"
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Impostazioni
            </a>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              Nuovo Report
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700 mb-8">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'text-red-400 border-b-2 border-red-500 bg-gray-800/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
          >
            <Shield className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors ${
              activeTab === 'reports'
                ? 'text-red-400 border-b-2 border-red-500 bg-gray-800/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
          >
            <FileText className="w-5 h-5" />
            Reports
          </button>
          <button
            onClick={() => setActiveTab('platforms')}
            className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors ${
              activeTab === 'platforms'
                ? 'text-red-400 border-b-2 border-red-500 bg-gray-800/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
          >
            <Monitor className="w-5 h-5" />
            Platforms
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors ${
              activeTab === 'achievements'
                ? 'text-red-400 border-b-2 border-red-500 bg-gray-800/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
            }`}
          >
            <Trophy className="w-5 h-5" />
            Achievements
          </button>
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Total Bugs</h3>
                <p className="text-3xl font-bold text-white">{stats.totalBugs}</p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Critical & High</h3>
                <p className="text-3xl font-bold text-white">{stats.criticalBugs + stats.highBugs}</p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Total Rewards</h3>
                <p className="text-3xl font-bold text-white">{formatCurrency(stats.totalReward)}</p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">CVEs Assigned</h3>
                <p className="text-3xl font-bold text-white">{stats.cveAssigned}</p>
              </div>
            </div>
          )}

          {/* Recent Reports */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Reports</h2>
              <button
                onClick={() => setActiveTab('reports')}
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                View All →
              </button>
            </div>
            
            <div className="space-y-4">
              {recentReports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.severity === 'CRITICAL' ? 'bg-purple-500/20 text-purple-400' :
                      report.severity === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                      report.severity === 'MEDIUM' ? 'bg-orange-500/20 text-orange-400' :
                      report.severity === 'LOW' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {report.severity}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{report.title}</h3>
                      <p className="text-sm text-gray-400">{report.program}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {report.reward && (
                      <p className="text-green-400 font-medium">{formatCurrency(report.reward)}</p>
                    )}
                    <p className="text-xs text-gray-500">{formatDate(report.discoveredAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Bug Reports Management</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm">
                <Plus className="w-4 h-4" />
                New Report
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Title</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Severity</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Program</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Reward</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-800 hover:bg-gray-700/30">
                    <td className="py-3 px-4 text-white">{report.title}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)} bg-current/20`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{report.program}</td>
                    <td className="py-3 px-4 text-green-400">
                      {report.reward ? formatCurrency(report.reward) : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{report.status}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1 text-blue-400 hover:bg-blue-500/20 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-yellow-400 hover:bg-yellow-500/20 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-400 hover:bg-red-500/20 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Platforms Tab */}
      {activeTab === 'platforms' && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Platform Management</h2>
            <div className="flex gap-2">
              <button 
                onClick={handleSyncPlatforms}
                disabled={syncing}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                Sync All
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm">
                <Plus className="w-4 h-4" />
                Add Platform
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <div key={platform.id} className="bg-gray-700/30 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{platform.name}</h3>
                  <div className={`w-3 h-3 rounded-full ${platform.active ? 'bg-green-400' : 'bg-red-400'}`}></div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Username:</span>
                    <span className="text-white">{platform.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reputation:</span>
                    <span className="text-white">{platform.reputation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bugs Submitted:</span>
                    <span className="text-white">{platform.bugsSubmitted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Earnings:</span>
                    <span className="text-green-400">{formatCurrency(platform.totalEarnings)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-600">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                    <ExternalLink className="w-4 h-4" />
                    View Profile
                  </button>
                  <button className="p-2 text-gray-400 hover:bg-gray-600 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Achievements Management</h2>
            <button className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm">
              <Plus className="w-4 h-4" />
              New Achievement
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-gray-700/30 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  {achievement.featured && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                      Featured
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{achievement.category}</p>
                <p className="text-xs text-gray-500">{formatDate(achievement.earnedAt)}</p>
                
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-600">
                  <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-400 hover:bg-red-500/20 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}