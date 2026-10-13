import { ArrowUpRight } from 'lucide-react';
import Image from '@/components/runtime/Image';
import Link from '@/components/runtime/Link';
import { useApi } from '@/lib/http';
import type { ProjectsResponse } from '@/types/project';

export default function SelectedWork() {
  const { data, loading, error } = useApi<ProjectsResponse>('/api/projects?featured=true&sortBy=priority&limit=3');
  return (
    <section id="selected-work" className="noir-work noir-container" tabIndex={-1} aria-labelledby="work-title">
      <div className="noir-section-heading">
        <div><p className="noir-eyebrow">01 / Il portfolio</p><h2 id="work-title">Il codice<br />prende <em>forma.</em></h2></div>
        <div className="noir-section-aside"><p>Progetti reali, sviluppati su misura.<br />Dall’interfaccia a quello che c’è dietro.</p><Link href="/projects" className="noir-text-link">Tutti i progetti <ArrowUpRight size={18} /></Link></div>
      </div>
      {loading && <div className="noir-work-loading" role="status">Caricamento dei progetti…</div>}
      {error && <p className="noir-work-loading">I progetti sono momentaneamente non disponibili. <Link href="/projects">Apri il portfolio →</Link></p>}
      {data && <div className="noir-project-grid">{data.projects.map((project, index) => (
        <Link key={project.id} href={`/projects/${project.slug}`} className="noir-project">
          <div className="noir-project-image">
            {project.featuredImage ? <Image src={project.featuredImage} alt={`Anteprima di ${project.title}`} fill className="object-cover object-top" /> : <span className="noir-project-placeholder">{project.title}</span>}
            <span className="noir-project-number">0{index + 1}</span><span className="noir-project-open"><ArrowUpRight size={24} /></span>
          </div>
          <div className="noir-project-meta"><span>{project.category}</span><span>{project.technologies.slice(0, 2).join(' / ')}</span></div>
          <h3>{project.title}</h3><p>{project.description}</p>
        </Link>
      ))}</div>}
      {data?.projects.length === 0 && <p className="noir-work-loading">Scopri i lavori nel <Link href="/projects">portfolio completo →</Link></p>}
    </section>
  );
}
