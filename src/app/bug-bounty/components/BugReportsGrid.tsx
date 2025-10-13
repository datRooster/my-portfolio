'use client';

import { useState, useEffect } from 'react';
import { Clock, ExternalLink, Shield, AlertTriangle, AlertCircle, Info, Calendar, DollarSign, Eye, FileText } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import ReportsFilters, { FilterState } from './ReportsFilters';

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
  methodology: string[];
  tools: string[];
  impact: string;
  affectedAssets: string[];
  reproducible: boolean;
  duplicate: boolean;
}

const severityConfig = {
  CRITICAL: { 
    icon: Shield, 
    color: 'text-purple-600 dark:text-purple-400', 
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    label: 'Critical'
  },
  HIGH: { 
    icon: AlertTriangle, 
    color: 'text-red-600 dark:text-red-400', 
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    label: 'High'
  },
  MEDIUM: { 
    icon: AlertCircle, 
    color: 'text-orange-600 dark:text-orange-400', 
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    label: 'Medium'
  },
  LOW: { 
    icon: Info, 
    color: 'text-yellow-600 dark:text-yellow-400', 
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    label: 'Low'
  },
  INFORMATIONAL: { 
    icon: Info, 
    color: 'text-blue-600 dark:text-blue-400', 
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    label: 'Info'
  }
};

const statusConfig = {
  SUBMITTED: { color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
  TRIAGING: { color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
  ACCEPTED: { color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/20' },
  RESOLVED: { color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
  FIXED: { color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/20' },
  DUPLICATE: { color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-900/20' },
  NOT_APPLICABLE: { color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/20' },
  DISCLOSED: { color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-100 dark:bg-indigo-900/20' }
};

export default function BugReportsGrid() {
  const [reports, setReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    severity: 'all',
    status: 'all',
    platform: 'all',
    category: 'all',
    search: '',
    sortBy: 'discoveredAt',
    sortOrder: 'desc'
  });

  const limit = 12;

  useEffect(() => {
    fetchReports(true);
  }, [filters]);

  const fetchReports = async (reset = false) => {
    try {
      setLoading(true);
      const currentOffset = reset ? 0 : offset;
      
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: currentOffset.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      if (filters.severity !== 'all') params.append('severity', filters.severity);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.platform !== 'all') params.append('platform', filters.platform);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/bug-bounty/reports?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        
        if (reset) {
          setReports(data.reports || []);
          setOffset(limit);
        } else {
          setReports(prev => [...prev, ...(data.reports || [])]);
          setOffset(prev => prev + limit);
        }
        
        setTotalCount(data.totalCount || 0);
        setHasMore(data.hasMore || false);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchReports(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatReward = (reward: number | null, currency: string | null) => {
    if (!reward) return null;
    return `${currency || 'USD'} ${reward.toLocaleString()}`;
  };

  const getCategoryLabel = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  return (
    <div className="space-y-6">
      <ReportsFilters onFiltersChange={setFilters} />

      {/* Results Summary */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-lg px-6 py-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {reports.length} of {totalCount} reports
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filters.search && `Search: "${filters.search}"`}
        </div>
      </div>

      {loading && reports.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Reports Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reports.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                No reports found matching the current filters.
              </div>
            ) : (
              reports.map((report) => {
                const severityInfo = severityConfig[report.severity as keyof typeof severityConfig] || severityConfig.LOW;
                const statusInfo = statusConfig[report.status as keyof typeof statusConfig];
                const SeverityIcon = severityInfo.icon;
                const rewardAmount = formatReward(report.reward, report.currency);

                return (
                  <div
                    key={report.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 ${severityInfo.borderColor}`}
                  >
                    {/* Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`p-2 rounded-lg ${severityInfo.bgColor}`}>
                            <SeverityIcon className={`h-5 w-5 ${severityInfo.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 leading-tight">
                              {report.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">
                              {report.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2 ml-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${severityInfo.bgColor} ${severityInfo.color}`}>
                            {severityInfo.label}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                            {getStatusLabel(report.status)}
                          </span>
                        </div>
                      </div>

                      {/* Impact */}
                      {report.impact && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong className="text-gray-900 dark:text-white">Impact:</strong> {report.impact}
                          </p>
                        </div>
                      )}

                      {/* Meta Information */}
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div>
                          <span className="font-medium">Program:</span>
                          <div className="text-gray-900 dark:text-white">{report.program}</div>
                        </div>
                        <div>
                          <span className="font-medium">Platform:</span>
                          <div className="text-gray-900 dark:text-white">{report.platform}</div>
                        </div>
                        <div>
                          <span className="font-medium">Category:</span>
                          <div className="text-gray-900 dark:text-white">{getCategoryLabel(report.category)}</div>
                        </div>
                        {rewardAmount && (
                          <div>
                            <span className="font-medium">Reward:</span>
                            <div className="text-green-600 dark:text-green-400 font-bold">{rewardAmount}</div>
                          </div>
                        )}
                      </div>

                      {/* Methodology & Tools */}
                      {(report.methodology.length > 0 || report.tools.length > 0) && (
                        <div className="space-y-2 mb-4">
                          {report.methodology.length > 0 && (
                            <div>
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Methodology:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {report.methodology.slice(0, 3).map((method, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                                  >
                                    {method}
                                  </span>
                                ))}
                                {report.methodology.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                    +{report.methodology.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {report.tools.length > 0 && (
                            <div>
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Tools:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {report.tools.slice(0, 3).map((tool, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 text-xs rounded-full"
                                  >
                                    {tool}
                                  </span>
                                ))}
                                {report.tools.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                    +{report.tools.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-xl">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(report.discoveredAt)}
                          </span>
                          {report.cveId && (
                            <span className="font-mono text-blue-600 dark:text-blue-400 font-medium">
                              {report.cveId}
                            </span>
                          )}
                          {report.duplicate && (
                            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                              Duplicate
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {report.publicUrl && (
                            <a
                              href={report.publicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              title="View public disclosure"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                          )}
                          {report.blogPostUrl && (
                            <a
                              href={report.blogPostUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                              title="Read blog post"
                            >
                              <FileText className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Loading...' : 'Load More Reports'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}