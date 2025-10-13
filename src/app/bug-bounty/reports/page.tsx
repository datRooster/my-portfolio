import { Suspense } from 'react';
import { Metadata } from 'next';
import Navigation from '@/components/ui/Navigation';
import BugReportsGrid from '../components/BugReportsGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { FileText, Search, Filter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bug Reports - Bug Bounty Portfolio',
  description: 'Detailed view of all bug bounty reports, vulnerabilities found, and security research.',
  keywords: ['bug reports', 'vulnerabilities', 'security research', 'CVE', 'responsible disclosure'],
};

export default function BugReportsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Bug Reports
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Collezione completa di vulnerabilità scoperte, analizzate e responsabilmente divulgate
          </p>
        </div>

        {/* Reports Grid (includes filters) */}
        <Suspense fallback={<LoadingSpinner />}>
          <BugReportsGrid />
        </Suspense>
      </div>
    </div>
  );
}