'use client';

import { 
  Shield, 
  AlertTriangle, 
  DollarSign, 
  Trophy,
  Clock,
  Lightbulb
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

interface StatsOverviewProps {
  stats: BugBountyStats | null;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-800 animate-pulse">
            <div className="h-8 w-8 bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-6 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Bugs Found',
      value: stats.totalBugs.toLocaleString(),
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/50',
      description: 'Security vulnerabilities discovered'
    },
    {
      title: 'Critical + High',
      value: (stats.criticalBugs + stats.highBugs).toLocaleString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/50',
      description: 'High-impact vulnerabilities'
    },
    {
      title: 'Total Bounty',
      value: `$${stats.totalReward.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/50',
      description: 'Total rewards earned'
    },
    {
      title: 'CVE Assigned',
      value: stats.cveAssigned.toLocaleString(),
      icon: Trophy,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/50',
      description: 'Common Vulnerabilities & Exposures'
    },
    {
      title: 'Avg Resolution',
      value: `${stats.avgResolutionDays.toFixed(1)} days`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/50',
      description: 'Average time to resolution'
    },
    {
      title: 'Fastest Fix',
      value: `${stats.fastestResolution}h`,
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
      description: 'Quickest vulnerability fix'
    },
    {
      title: 'Avg Reward',
      value: `$${stats.avgRewardPerBug.toFixed(0)}`,
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/50',
      description: 'Average bounty per bug'
    },
    {
      title: 'Severity Distribution',
      value: `${Math.round((stats.criticalBugs + stats.highBugs) / stats.totalBugs * 100)}%`,
      icon: Shield,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100 dark:bg-pink-900/50',
      description: 'Critical & High severity bugs'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:bg-gray-900/70"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.bgColor.replace('dark:bg-', 'bg-').replace('/50', '/20')}`}>
              <stat.icon className={`h-6 w-6 ${stat.color.replace('600', '400')}`} />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold text-white">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500">
              {stat.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}