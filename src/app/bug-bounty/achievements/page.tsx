import { Suspense } from 'react';
import { Metadata } from 'next';
import Navigation from '@/components/ui/Navigation';
import AchievementsGrid from '../components/AchievementsGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { Trophy } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Achievements - Bug Bounty Portfolio',
  description: 'Bug bounty achievements, recognitions, certifications, and milestones in cybersecurity.',
  keywords: ['bug bounty achievements', 'cybersecurity certifications', 'security awards', 'hall of fame'],
};

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl backdrop-blur-sm">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Achievements & Recognition
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Traguardi, certificazioni, premi e riconoscimenti nel percorso di cybersecurity e bug bounty hunting
          </p>
        </div>

        {/* Achievements Grid */}
        <Suspense fallback={<LoadingSpinner />}>
          <AchievementsGrid />
        </Suspense>
      </div>
    </div>
  );
}