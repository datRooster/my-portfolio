import { Suspense } from 'react';
import { Metadata } from 'next';
import Navigation from '@/components/ui/Navigation';
import MethodologyGrid from '../components/MethodologyGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Methodologies - Bug Bounty Portfolio',
  description: 'Detailed methodologies, techniques, and approaches used in bug bounty hunting and security research.',
  keywords: ['bug bounty methodology', 'security testing', 'penetration testing', 'vulnerability assessment'],
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl backdrop-blur-sm">
              <BookOpen className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Testing Methodologies
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Approcci sistematici, tecniche e framework utilizzati per la ricerca di vulnerabilità e security testing
          </p>
        </div>

        {/* Methodologies Grid */}
        <Suspense fallback={<LoadingSpinner />}>
          <MethodologyGrid />
        </Suspense>
      </div>
    </div>
  );
}