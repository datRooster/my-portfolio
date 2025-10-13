'use client';

import { useState } from 'react';
import { Filter, Search, SortAsc, SortDesc } from 'lucide-react';

interface ReportsFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
}

export interface FilterState {
  severity: string;
  status: string;
  platform: string;
  category: string;
  search: string;
  sortBy: string;
  sortOrder: string;
}

const severityOptions = [
  { value: 'all', label: 'All Severities' },
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
  { value: 'INFORMATIONAL', label: 'Informational' }
];

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'TRIAGING', label: 'Triaging' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'FIXED', label: 'Fixed' },
  { value: 'DUPLICATE', label: 'Duplicate' },
  { value: 'NOT_APPLICABLE', label: 'Not Applicable' },
  { value: 'DISCLOSED', label: 'Disclosed' }
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'SQL_INJECTION', label: 'SQL Injection' },
  { value: 'XSS_REFLECTED', label: 'Reflected XSS' },
  { value: 'XSS_STORED', label: 'Stored XSS' },
  { value: 'XSS_DOM', label: 'DOM XSS' },
  { value: 'CSRF', label: 'CSRF' },
  { value: 'IDOR', label: 'IDOR' },
  { value: 'AUTHENTICATION_BYPASS', label: 'Auth Bypass' },
  { value: 'AUTHORIZATION_FLAW', label: 'Authorization Flaw' },
  { value: 'RCE', label: 'RCE' },
  { value: 'LFI', label: 'LFI' },
  { value: 'BUSINESS_LOGIC', label: 'Business Logic' },
  { value: 'API_MISCONFIGURATION', label: 'API Misconfiguration' },
  { value: 'OTHER', label: 'Other' }
];

const sortOptions = [
  { value: 'discoveredAt', label: 'Discovery Date' },
  { value: 'reportedAt', label: 'Report Date' },
  { value: 'severity', label: 'Severity' },
  { value: 'reward', label: 'Reward' },
  { value: 'title', label: 'Title' },
  { value: 'program', label: 'Program' }
];

export default function ReportsFilters({ onFiltersChange }: ReportsFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    severity: 'all',
    status: 'all',
    platform: 'all',
    category: 'all',
    search: '',
    sortBy: 'discoveredAt',
    sortOrder: 'desc'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      severity: 'all',
      status: 'all',
      platform: 'all',
      category: 'all',
      search: '',
      sortBy: 'discoveredAt',
      sortOrder: 'desc'
    };
    setFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports by title, description, or program..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Primary Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Severity
          </label>
          <select
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {severityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Order
          </label>
          <button
            onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
            className="w-full flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {filters.sortOrder === 'desc' ? (
              <>
                <SortDesc className="h-4 w-4" />
                <span>Desc</span>
              </>
            ) : (
              <>
                <SortAsc className="h-4 w-4" />
                <span>Asc</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
        >
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
        </button>

        <button
          onClick={resetFilters}
          className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium"
        >
          Reset All
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Platform
              </label>
              <input
                type="text"
                placeholder="Filter by platform (e.g., HackerOne, Bugcrowd)..."
                value={filters.platform}
                onChange={(e) => handleFilterChange('platform', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}