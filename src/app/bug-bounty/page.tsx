import { Suspense } from 'react';
import { Metadata } from 'next';
import Navigation from '@/components/ui/Navigation';
import BugBountyDashboard from './components/BugBountyDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import { Shield, Bug, Target, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bug Bounty - Portfolio',
  description: 'My bug bounty hunting achievements, reports, and methodologies.',
  keywords: ['bug bounty', 'cybersecurity', 'vulnerability research', 'ethical hacking'],
};

export default function BugBountyPage() {
  return (
    <>
      <Navigation showBackButton={true} backUrl="/" backLabel="Home" />
      <div className="bg-gray-950 text-gray-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl mb-8 animate-pulse">
              <Shield className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Bug Bounty
              </span>
              <br />
              <span className="text-white">Portfolio</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Exploring cybersecurity through ethical hacking, vulnerability research, and responsible disclosure. 
              Here's my journey in the world of bug bounty hunting.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <Bug className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">15+</div>
                <div className="text-sm text-gray-400">Vulnerabilities</div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <Target className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">$12.5K</div>
                <div className="text-sm text-gray-400">Total Rewards</div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-sm text-gray-400">CVEs Assigned</div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">12.5</div>
                <div className="text-sm text-gray-400">Avg Resolution Days</div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard */}
        <section className="relative py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <BugBountyDashboard />
            </Suspense>
          </div>
        </section>
      </div>
    </>
  );
}