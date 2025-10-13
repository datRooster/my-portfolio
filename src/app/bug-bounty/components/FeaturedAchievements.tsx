'use client';

import { Trophy, Star, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';

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
  points: number | null;
  monetaryValue: number | null;
  featured: boolean;
}

interface FeaturedAchievementsProps {
  achievements: Achievement[];
}

const categoryIcons = {
  FIRST_BUG: Trophy,
  SEVERITY_MILESTONE: Star,
  PLATFORM_MILESTONE: Trophy,
  FINANCIAL_MILESTONE: Trophy,
  RECOGNITION: Star,
  COLLABORATION: Trophy,
  COMMUNITY: Star,
  CERTIFICATION: Trophy,
  CVE_ASSIGNMENT: Star,
  HALL_OF_FAME: Trophy,
  SPECIAL_EVENT: Star,
  ANNIVERSARY: Trophy,
};

const difficultyColors = {
  EASY: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20',
  MEDIUM: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20',
  HARD: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20',
  LEGENDARY: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20'
};

export default function FeaturedAchievements({ achievements }: FeaturedAchievementsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-900/50 rounded-xl backdrop-blur-sm border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Featured Achievements
        </h2>
        <Link 
          href="/bug-bounty/achievements"
          className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="space-y-4">
        {achievements.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No featured achievements found
          </div>
        ) : (
          achievements.map((achievement) => {
            const CategoryIcon = categoryIcons[achievement.category as keyof typeof categoryIcons] || Trophy;
            const difficultyStyle = difficultyColors[achievement.difficulty as keyof typeof difficultyColors] || difficultyColors.MEDIUM;

            return (
              <div
                key={achievement.id}
                className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all bg-gray-800/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    {achievement.badgeUrl ? (
                      <img
                        src={achievement.badgeUrl}
                        alt={achievement.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                        <CategoryIcon className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyStyle}`}>
                      {achievement.difficulty}
                    </span>
                    {achievement.rarity && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {achievement.rarity}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>{achievement.issuedBy}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(achievement.earnedAt)}
                    </span>
                    {achievement.points && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {achievement.points} pts
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {achievement.monetaryValue && (
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${achievement.monetaryValue}
                      </span>
                    )}
                    {(achievement.certificateUrl || achievement.verificationUrl) && (
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