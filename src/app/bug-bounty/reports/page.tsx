import Link from '@/components/runtime/Link';
import CinematicHero from '@/components/home/CinematicHero';
import Navigation from '@/components/ui/Navigation';

import { Suspense } from 'react';
import BugReportsGrid from '../components/BugReportsGrid';
import LoadingSpinner from '../components/LoadingSpinner';


export default function BugReportsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation overlay />
      
      <CinematicHero sceneKey="security" compact title="Bug Reports" description="Collezione completa di vulnerabilità scoperte, analizzate e responsabilmente divulgate" targetId="security-detail-content" secondary={{href:'/bug-bounty',label:'Panoramica sicurezza'}} />
      <div id="security-detail-content" tabIndex={-1} className="noir-detail-content">
      <div className="noir-detail-meta"><Link href="/bug-bounty">← Panoramica sicurezza</Link><span>Cybersecurity</span></div>
        <Suspense fallback={<LoadingSpinner />}>
          <BugReportsGrid />
        </Suspense>
      </div>
    </div>
  );
}