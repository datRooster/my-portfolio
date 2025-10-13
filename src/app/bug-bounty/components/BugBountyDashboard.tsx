'use client';

import { useState, useEffect } from 'react';
import StatsOverview from './StatsOverview';
import RecentReports from './RecentReports';
import PlatformsGrid from './PlatformsGrid';
import FeaturedAchievements from './FeaturedAchievements';
import LoadingSpinner from './LoadingSpinner';

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

export default function BugBountyDashboard() {
  const [stats, setStats] = useState<BugBountyStats | null>(null);
  const [recentReports, setRecentReports] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await fetch('/api/bug-bounty/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch recent reports (limit 6)
      const reportsRes = await fetch('/api/bug-bounty/reports?limit=6&sortBy=discoveredAt&sortOrder=desc');
      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setRecentReports(reportsData.reports || []);
      }

      // Fetch active platforms
      const platformsRes = await fetch('/api/bug-bounty/platforms?active=true');
      if (platformsRes.ok) {
        const platformsData = await platformsRes.json();
        setPlatforms(platformsData || []);
      }

      // Fetch featured achievements
      const achievementsRes = await fetch('/api/bug-bounty/achievements?featured=true');
      if (achievementsRes.ok) {
        const achievementsData = await achievementsRes.json();
        setAchievements(achievementsData || []);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <StatsOverview stats={stats} />
      
      {/* Recent Reports & Featured Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentReports reports={recentReports} />
        <FeaturedAchievements achievements={achievements} />
      </div>
      
      {/* Platforms Grid */}
      <PlatformsGrid platforms={platforms} />
    </div>
  );
}