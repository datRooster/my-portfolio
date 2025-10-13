'use client';

import { useState, useEffect } from 'react';
import { Code, Clock, Target, Users, BookOpen, ExternalLink, Star, Zap } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface Methodology {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: string[];
  tools: string[];
  prerequisites: string[];
  exampleTargets: string[];
  examplePayloads: string[];
  commonMistakes: string[];
  difficulty: string;
  estimatedTime: string | null;
  successRate: number | null;
  resources: string[];
  references: string[];
  timesUsed: number;
  bugsFound: number;
  lastUsed: string | null;
  featured: boolean;
  publicVisible: boolean;
}

const categoryIcons = {
  WEB_APPLICATION: Code,
  API_TESTING: Target,
  MOBILE_APPLICATION: Target,
  INFRASTRUCTURE: Target,
  SOCIAL_ENGINEERING: Users,
  PHYSICAL_SECURITY: Target,
  CRYPTOGRAPHY: Code,
  REVERSE_ENGINEERING: Code,
  BUSINESS_LOGIC: Target,
  RECONNAISSANCE: Target,
  AUTOMATION: Zap,
  MANUAL_TESTING: BookOpen,
};

const categoryLabels = {
  WEB_APPLICATION: 'Web Application',
  API_TESTING: 'API Testing',
  MOBILE_APPLICATION: 'Mobile Application',
  INFRASTRUCTURE: 'Infrastructure',
  SOCIAL_ENGINEERING: 'Social Engineering',
  PHYSICAL_SECURITY: 'Physical Security',
  CRYPTOGRAPHY: 'Cryptography',
  REVERSE_ENGINEERING: 'Reverse Engineering',
  BUSINESS_LOGIC: 'Business Logic',
  RECONNAISSANCE: 'Reconnaissance',
  AUTOMATION: 'Automation',
  MANUAL_TESTING: 'Manual Testing',
};

const difficultyColors = {
  BEGINNER: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
  INTERMEDIATE: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
  ADVANCED: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300',
  EXPERT: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
};

export default function MethodologyGrid() {
  const [methodologies, setMethodologies] = useState<Methodology[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    fetchMethodologies();
  }, [filter, sortBy]);

  const fetchMethodologies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filter !== 'all') {
        params.append('category', filter);
      }
      
      const response = await fetch(`/api/bug-bounty/methodologies?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        
        // Sort methodologies
        const sorted = [...data].sort((a, b) => {
          if (sortBy === 'featured') {
            if (a.featured !== b.featured) {
              return b.featured ? 1 : -1;
            }
            return b.bugsFound - a.bugsFound;
          } else if (sortBy === 'difficulty') {
            const difficultyOrder = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3, EXPERT: 4 };
            return difficultyOrder[b.difficulty as keyof typeof difficultyOrder] - 
                   difficultyOrder[a.difficulty as keyof typeof difficultyOrder];
          } else if (sortBy === 'success') {
            return (b.successRate || 0) - (a.successRate || 0);
          } else if (sortBy === 'usage') {
            return b.timesUsed - a.timesUsed;
          }
          return a.name.localeCompare(b.name);
        });
        
        setMethodologies(sorted);
      }
    } catch (error) {
      console.error('Error fetching methodologies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSuccessRate = (methodology: Methodology) => {
    if (methodology.successRate !== null) {
      return `${methodology.successRate}%`;
    }
    if (methodology.timesUsed > 0) {
      return `${Math.round((methodology.bugsFound / methodology.timesUsed) * 100)}%`;
    }
    return 'N/A';
  };

  const formatLastUsed = (lastUsed: string | null) => {
    if (!lastUsed) return 'Never';
    return new Date(lastUsed).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const categories = Object.keys(categoryLabels);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category:
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="featured">Featured & Success</option>
              <option value="difficulty">Difficulty</option>
              <option value="success">Success Rate</option>
              <option value="usage">Usage Count</option>
            </select>
          </div>
        </div>
      </div>

      {/* Methodologies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {methodologies.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            No methodologies found for the selected filter.
          </div>
        ) : (
          methodologies.map((methodology) => {
            const CategoryIcon = categoryIcons[methodology.category as keyof typeof categoryIcons] || BookOpen;
            const difficultyStyle = difficultyColors[methodology.difficulty as keyof typeof difficultyColors];

            return (
              <div
                key={methodology.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow ${
                  methodology.featured ? 'ring-2 ring-blue-400 dark:ring-blue-500' : ''
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                      <CategoryIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {methodology.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {categoryLabels[methodology.category as keyof typeof categoryLabels]}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {methodology.featured && (
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyStyle}`}>
                      {methodology.difficulty}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {methodology.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                      {methodology.timesUsed}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Times Used</p>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-green-600 dark:text-green-400">
                      {methodology.bugsFound}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Bugs Found</p>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-purple-600 dark:text-purple-400">
                      {getSuccessRate(methodology)}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Success Rate</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  {methodology.estimatedTime && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Estimated time: {methodology.estimatedTime}</span>
                    </div>
                  )}
                  
                  {methodology.steps.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Steps ({methodology.steps.length})</h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <ol className="list-decimal list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {methodology.steps.slice(0, 3).map((step, index) => (
                            <li key={index} className="truncate">{step}</li>
                          ))}
                          {methodology.steps.length > 3 && (
                            <li className="text-gray-500 dark:text-gray-400">
                              +{methodology.steps.length - 3} more steps...
                            </li>
                          )}
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* Tools */}
                  {methodology.tools.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tools</h4>
                      <div className="flex flex-wrap gap-1">
                        {methodology.tools.slice(0, 5).map((tool, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                          >
                            {tool}
                          </span>
                        ))}
                        {methodology.tools.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                            +{methodology.tools.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {methodology.prerequisites.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Prerequisites</h4>
                      <div className="flex flex-wrap gap-1">
                        {methodology.prerequisites.slice(0, 3).map((prereq, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 text-xs rounded-full"
                          >
                            {prereq}
                          </span>
                        ))}
                        {methodology.prerequisites.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                            +{methodology.prerequisites.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                  <div>
                    Last used: {formatLastUsed(methodology.lastUsed)}
                  </div>
                  <div className="flex items-center space-x-2">
                    {methodology.resources.length > 0 && (
                      <span className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {methodology.resources.length} resources
                      </span>
                    )}
                    {methodology.resources.some(r => r.startsWith('http')) && (
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