import Navigation from '@/components/ui/Navigation';
import { FileText } from 'lucide-react';
import { Suspense } from 'react';
import BugReportsGrid from '../components/BugReportsGrid';
import LoadingSpinner from '../components/LoadingSpinner';


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