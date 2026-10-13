import Image from '@/components/runtime/Image';
import Link from '@/components/runtime/Link';
import { isUserAdmin } from '@/lib/auth-client';
import type { Project } from '@/types/project';
import { ArrowUpRight, Code2, Edit, Github, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

const statusLabels = { completed: 'Completato', 'in-progress': 'In corso', archived: 'Archiviato', draft: 'Bozza' };

export default function ProjectCard({ project }: { project: Project }) {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => { let active = true; isUserAdmin().then(value => { if (active) setIsAdmin(value); }); return () => { active = false; }; }, []);
  const detail = '/projects/' + project.slug;
  return (
    <article className="portfolio-project">
      <Link href={detail} className="portfolio-project-cover" aria-label={'Scopri ' + project.title}>
        {project.featuredImage ? <Image src={project.featuredImage} alt={project.title} fill className="object-cover object-top" /> : <Code2 size={48} strokeWidth={1} />}
        {project.featured && <span className="portfolio-project-featured">In evidenza</span>}
        <span className="portfolio-project-arrow"><ArrowUpRight size={23} /></span>
      </Link>
      <div className="portfolio-project-category"><span>{project.category}</span><span>{statusLabels[project.status]}</span></div>
      <h3><Link href={detail}>{project.title}</Link></h3>
      <p className="portfolio-project-description">{project.description}</p>
      <div className="portfolio-project-tech">{project.technologies.slice(0, 4).join(' / ')}{project.technologies.length > 4 && ' / +' + (project.technologies.length - 4)}</div>
      <div className="portfolio-project-bottom">
        <Link href={detail} className="noir-text-link">Scopri il progetto <ArrowUpRight size={16} /></Link>
        <div>
          {project.publicationUrl && <a href={project.publicationUrl} target="_blank" rel="noopener noreferrer" aria-label="Plugin su WordPress.org" title="Plugin su WordPress.org"><Globe size={17} /></a>}
          {project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" aria-label="Repository" title="Repository"><Github size={17} /></a>}
          {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" aria-label="Demo Live" title="Demo Live"><ArrowUpRight size={17} /></a>}
          {isAdmin && <Link href={'/admin/projects/edit/' + project.slug} aria-label="Modifica progetto" title="Modifica progetto"><Edit size={17} /></Link>}
        </div>
      </div>
      <p className="portfolio-project-period">{project.period || new Date(project.createdAt).toLocaleDateString('it-IT', { year: 'numeric', month: 'short' })}</p>
    </article>
  );
}
