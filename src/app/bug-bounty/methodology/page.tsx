import Link from '@/components/runtime/Link';
import CinematicHero from '@/components/home/CinematicHero';
import Navigation from '@/components/ui/Navigation';

import { Suspense } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import MethodologyGrid from '../components/MethodologyGrid';


export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation overlay />
      
      <CinematicHero sceneKey="security" compact title="Metodologia" description="Il metodo di lavoro per la ricerca e l’analisi delle vulnerabilità." targetId="security-detail-content" secondary={{href:'/bug-bounty',label:'Panoramica sicurezza'}} />
      <div id="security-detail-content" tabIndex={-1} className="noir-detail-content">
      <div className="noir-detail-meta"><Link href="/bug-bounty">← Panoramica sicurezza</Link><span>Cybersecurity</span></div>
        <Suspense fallback={<LoadingSpinner />}>
          <MethodologyGrid />
        </Suspense>
      </div>
    </div>
  );
}