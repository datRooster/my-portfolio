import CinematicHero from '@/components/home/CinematicHero';
import Navigation from '@/components/ui/Navigation';
import { Award,Bug,Shield,Target } from 'lucide-react';
import { Suspense } from 'react';
import BugBountyDashboard from './components/BugBountyDashboard';
import LoadingSpinner from './components/LoadingSpinner';


export default function BugBountyPage() {
  return (
    <>
      <Navigation overlay />
      <div className="bg-gray-950 text-gray-100">
        {/* Hero Section */}
        <CinematicHero sceneKey="security" />

        {/* Dashboard */}
        <section id="security-content" tabIndex={-1} className="noir-content-section relative py-16 px-4">
          <div className="max-w-7xl mx-auto">
<p className="noir-demo-note">Dati dimostrativi · contenuti della sezione da aggiornare</p>{/* Quick Stats */}
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

            <Suspense fallback={<LoadingSpinner />}>
              <BugBountyDashboard />
            </Suspense>
          </div>
        </section>
      </div>
    </>
  );
}