import Link from '@/components/runtime/Link';
import CinematicHero from '@/components/home/CinematicHero';
import Navigation from '@/components/ui/Navigation';

import { Suspense } from 'react';
import AchievementsGrid from '../components/AchievementsGrid';
import LoadingSpinner from '../components/LoadingSpinner';


export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation overlay />
      
      <CinematicHero sceneKey="security" compact title="Riconoscimenti" description="Traguardi e contributi nel percorso di ricerca sulla sicurezza." targetId="security-detail-content" secondary={{href:'/bug-bounty',label:'Panoramica sicurezza'}} />
      <div id="security-detail-content" tabIndex={-1} className="noir-detail-content">
      <div className="noir-detail-meta"><Link href="/bug-bounty">← Panoramica sicurezza</Link><span>Cybersecurity</span></div>
        <Suspense fallback={<LoadingSpinner />}>
          <AchievementsGrid />
        </Suspense>
      </div>
    </div>
  );
}