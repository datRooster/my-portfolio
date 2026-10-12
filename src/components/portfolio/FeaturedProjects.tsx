import Link from '@/components/runtime/Link';
import ProjectCard from './ProjectCard';
import { useApi } from '@/lib/http';
import type { ProjectsResponse } from '@/types/project';

export default function FeaturedProjects() {
  const {data,loading,error}=useApi<ProjectsResponse>('/api/projects?featured=true&sortBy=priority&limit=3');
  return <section className="w-full max-w-6xl mb-20">
    <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
      <div><p className="text-yellow-400 text-xs font-semibold tracking-widest uppercase mb-3">Dal codice al progetto</p><h2 className="text-3xl md:text-4xl font-bold text-white">Lavori in evidenza</h2><p className="text-gray-400 mt-4 max-w-2xl">Temi su misura, strumenti WooCommerce e applicazioni web. Dentro ogni scheda: obiettivi, funzionalità e scelte di sviluppo.</p></div>
      <Link href="/projects" className="text-yellow-400 hover:text-yellow-200 text-sm font-semibold">Tutti i progetti →</Link>
    </div>
    {loading && <p role="status" className="text-gray-400">Caricamento progetti…</p>}
    {error && <p className="text-gray-400">I progetti non sono momentaneamente disponibili. <Link href="/projects" className="text-yellow-400">Apri il portfolio</Link>.</p>}
    {data && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{data.projects.map(project=><ProjectCard key={project.id} project={project}/>)}</div>}
  </section>;
}
