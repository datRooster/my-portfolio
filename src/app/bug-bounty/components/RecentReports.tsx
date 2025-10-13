'use client';

import { Clock, ExternalLink, Shield, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';

interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: string;
  category: string;
  program: string;
  platform: string;
  status: string;
  reward: number | null;
  currency: string | null;
  discoveredAt: string;
  reportedAt: string;
  resolvedAt: string | null;
  cveId: string | null;
  publicUrl: string | null;
  blogPostUrl: string | null;
}

interface RecentReportsProps {
  reports: BugReport[];
}

const severityConfig = {
  CRITICAL: { 
    icon: Shield, 
    color: 'text-purple-400', 
    bgColor: 'bg-purple-500/20',
    label: 'Critical'
  },
  HIGH: { 
    icon: AlertTriangle, 
    color: 'text-red-400', 
    bgColor: 'bg-red-500/20',
    label: 'High'
  },
  MEDIUM: { 
    icon: AlertCircle, 
    color: 'text-orange-400', 
    bgColor: 'bg-orange-500/20',
    label: 'Medium'
  },
  LOW: { 
    icon: Info, 
    color: 'text-yellow-400', 
    bgColor: 'bg-yellow-500/20',
    label: 'Low'
  },
  INFORMATIONAL: { 
    icon: Info, 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-500/20',
    label: 'Info'
  }
};

export default function RecentReports({ reports }: RecentReportsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatReward = (reward: number | null, currency: string | null) => {
    if (!reward) return 'N/A';
    return `${currency || 'USD'} ${reward.toLocaleString()}`;
  };

  return (
    <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Recent Reports</h2>
        <Link 
          href="/bug-bounty/reports" 
          className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center transition-colors"
        >
          View All
          <ExternalLink className="ml-1 h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No reports found
          </div>
        ) : (
          reports.map((report) => {
            const severityInfo = severityConfig[report.severity as keyof typeof severityConfig] || severityConfig.LOW;
            const SeverityIcon = severityInfo.icon;

            return (
              <div
                key={report.id}
                className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all bg-gray-800/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${severityInfo.bgColor}`}>
                      <SeverityIcon className={`h-4 w-4 ${severityInfo.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">
                        {report.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {report.description}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityInfo.bgColor} ${severityInfo.color}`}>
                    {severityInfo.label}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>{report.program}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(report.discoveredAt)}
                    </span>
                    {report.cveId && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-blue-400">
                          {report.cveId}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {report.reward && (
                      <span className="font-semibold text-green-400">
                        {formatReward(report.reward, report.currency)}
                      </span>
                    )}
                    {(report.publicUrl || report.blogPostUrl) && (
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}