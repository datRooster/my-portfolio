'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Calendar, ExternalLink, Award, Medal, Crown, Target } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string | null;
  badgeUrl: string | null;
  color: string | null;
  issuedBy: string;
  certificateUrl: string | null;
  verificationUrl: string | null;
  criteria: string | null;
  difficulty: string;
  rarity: string | null;
  earnedAt: string;
  expiresAt: string | null;
  points: number | null;
  monetaryValue: number | null;
  featured: boolean;
  publicVisible: boolean;
}

const categoryIcons = {
  FIRST_BUG: Target,
  SEVERITY_MILESTONE: Star,
  PLATFORM_MILESTONE: Trophy,
  FINANCIAL_MILESTONE: Medal,
  RECOGNITION: Award,
  COLLABORATION: Trophy,
  COMMUNITY: Star,
  CERTIFICATION: Award,
  CVE_ASSIGNMENT: Crown,
  HALL_OF_FAME: Trophy,
  SPECIAL_EVENT: Star,
  ANNIVERSARY: Medal,
};

const categoryLabels = {
  FIRST_BUG: 'First Bug',
  SEVERITY_MILESTONE: 'Severity Milestone',
  PLATFORM_MILESTONE: 'Platform Milestone',
  FINANCIAL_MILESTONE: 'Financial Milestone',
  RECOGNITION: 'Recognition',
  COLLABORATION: 'Collaboration',
  COMMUNITY: 'Community',
  CERTIFICATION: 'Certification',
  CVE_ASSIGNMENT: 'CVE Assignment',
  HALL_OF_FAME: 'Hall of Fame',
  SPECIAL_EVENT: 'Special Event',
  ANNIVERSARY: 'Anniversary',
};

const difficultyColors = {
  EASY: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
  MEDIUM: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
  HARD: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300',
  LEGENDARY: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300'
};

const rarityColors = {
  'Common': 'text-gray-600 dark:text-gray-400',
  'Uncommon': 'text-green-600 dark:text-green-400',
  'Rare': 'text-blue-600 dark:text-blue-400',
  'Epic': 'text-purple-600 dark:text-purple-400',
  'Legendary': 'text-yellow-600 dark:text-yellow-400'
};

export default function AchievementsGrid() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('earnedAt');

  useEffect(() => {
    fetchAchievements();
  }, [filter, sortBy]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filter !== 'all') {
        params.append('category', filter);
      }
      
      const response = await fetch(`/api/bug-bounty/achievements?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        
        // Sort achievements
        const sorted = [...data].sort((a, b) => {
          if (sortBy === 'earnedAt') {
            return new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime();
          } else if (sortBy === 'difficulty') {
            const difficultyOrder = { EASY: 1, MEDIUM: 2, HARD: 3, LEGENDARY: 4 };
            return difficultyOrder[b.difficulty as keyof typeof difficultyOrder] - 
                   difficultyOrder[a.difficulty as keyof typeof difficultyOrder];
          } else if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
          }
          return 0;
        });
        
        setAchievements(sorted);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
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
              <option value="earnedAt">Date Earned</option>
              <option value="difficulty">Difficulty</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            No achievements found for the selected filter.
          </div>
        ) : (
          achievements.map((achievement) => {
            const CategoryIcon = categoryIcons[achievement.category as keyof typeof categoryIcons] || Trophy;
            const difficultyStyle = difficultyColors[achievement.difficulty as keyof typeof difficultyColors];
            const rarityColor = rarityColors[achievement.rarity as keyof typeof rarityColors] || rarityColors['Common'];
            const expired = isExpired(achievement.expiresAt);

            return (
              <div
                key={achievement.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow ${
                  expired ? 'opacity-75' : ''
                } ${achievement.featured ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    {achievement.badgeUrl ? (
                      <img
                        src={achievement.badgeUrl}
                        alt={achievement.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div 
                        className="p-3 rounded-xl"
                        style={{ 
                          backgroundColor: achievement.color || '#f3f4f6',
                          color: achievement.color ? '#ffffff' : '#374151'
                        }}
                      >
                        <CategoryIcon className="h-6 w-6" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {categoryLabels[achievement.category as keyof typeof categoryLabels]}
                      </p>
                    </div>
                  </div>
                  {achievement.featured && (
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {achievement.description}
                </p>

                {/* Criteria */}
                {achievement.criteria && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Criteria:</strong> {achievement.criteria}
                    </p>
                  </div>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyStyle}`}>
                    {achievement.difficulty}
                  </span>
                  {achievement.rarity && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 ${rarityColor}`}>
                      {achievement.rarity}
                    </span>
                  )}
                  {expired && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300">
                      Expired
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center justify-between">
                    <span>Issued by:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {achievement.issuedBy}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Earned:</span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(achievement.earnedAt)}
                    </span>
                  </div>
                  {achievement.points && (
                    <div className="flex items-center justify-between">
                      <span>Points:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {achievement.points}
                      </span>
                    </div>
                  )}
                  {achievement.monetaryValue && (
                    <div className="flex items-center justify-between">
                      <span>Value:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        ${achievement.monetaryValue}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    {achievement.certificateUrl && (
                      <a
                        href={achievement.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {achievement.verificationUrl && (
                      <a
                        href={achievement.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  
                  {achievement.expiresAt && !expired && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Expires {formatDate(achievement.expiresAt)}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}