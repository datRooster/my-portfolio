'use client';

import { ExternalLink, Trophy, TrendingUp, Clock, Target, Users } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  username: string;
  profileUrl: string | null;
  reputation: number;
  rank: string | null;
  points: number;
  level: string | null;
  bugsSubmitted: number;
  bugsAccepted: number;
  bugsDuplicate: number;
  bugsInformational: number;
  totalEarnings: number;
  averageReward: number;
  currency: string;
  hallOfFame: number;
  certificates: string[];
  badges: string[];
  joinedAt: string | null;
  lastActive: string | null;
  activeMonths: number;
  active: boolean;
  featured: boolean;
  publicProfile: boolean;
}

interface PlatformsGridProps {
  platforms: Platform[];
}

const platformLogos: Record<string, string> = {
  'HackerOne': '🐛',
  'Bugcrowd': '🏆',
  'Synack': '🎯',
  'Intigriti': '⚡',
  'YesWeHack': '✅',
  'BugBountyHQ': '🕵️',
  'Cobalt': '🔷',
  'Default': '🔍'
};

export default function PlatformsGrid({ platforms }: PlatformsGridProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const getAcceptanceRate = (accepted: number, submitted: number) => {
    if (submitted === 0) return 0;
    return Math.round((accepted / submitted) * 100);
  };

  return (
    <div className="bg-gray-900/50 rounded-xl backdrop-blur-sm border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Bug Bounty Platforms
        </h2>
        <div className="text-sm text-gray-400">
          {platforms.length} Active Platform{platforms.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-400">
            No active platforms found
          </div>
        ) : (
          platforms.map((platform) => {
            const logo = platformLogos[platform.name] || platformLogos['Default'];
            const acceptanceRate = getAcceptanceRate(platform.bugsAccepted, platform.bugsSubmitted);

            return (
              <div
                key={platform.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{logo}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {platform.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        @{platform.username}
                      </p>
                    </div>
                  </div>
                  {platform.profileUrl && (
                    <a
                      href={platform.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        {platform.reputation}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Reputation</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Target className="h-4 w-4 text-green-500 mr-1" />
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        {platform.bugsAccepted}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Accepted</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        {acceptanceRate}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Accept Rate</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-purple-500 mr-1" />
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        {platform.hallOfFame}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Hall of Fame</p>
                  </div>
                </div>

                {/* Rank & Level */}
                {(platform.rank || platform.level) && (
                  <div className="flex items-center justify-between mb-4">
                    {platform.rank && (
                      <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-medium rounded-full">
                        {platform.rank}
                      </span>
                    )}
                    {platform.level && (
                      <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full">
                        {platform.level}
                      </span>
                    )}
                  </div>
                )}

                {/* Earnings */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Earnings</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(platform.totalEarnings, platform.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600 dark:text-gray-400">Avg Reward</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(platform.averageReward, platform.currency)}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-4">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Joined {formatDate(platform.joinedAt)}
                  </div>
                  <div>
                    {platform.activeMonths} months active
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