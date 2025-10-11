import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    completed: 'bg-green-500/10 text-green-400',
    'in-progress': 'bg-yellow-500/10 text-yellow-400',
    archived: 'bg-gray-500/10 text-gray-400',
    draft: 'bg-blue-500/10 text-blue-400'
  };

  const statusLabels = {
    completed: 'Completato',
    'in-progress': 'In Corso',
    archived: 'Archiviato',
    draft: 'Bozza'
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
      {/* Immagine */}
      {project.featuredImage && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={project.featuredImage}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {project.featured && (
            <div className="absolute top-3 left-3">
              <span className="bg-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
                ⭐ In Evidenza
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
              {statusLabels[project.status]}
            </span>
          </div>
        </div>
      )}

      {/* Contenuto */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-xl text-white group-hover:text-yellow-400 transition-colors">
              {project.title}
            </h3>
            {project.priority > 3 && (
              <div className="text-yellow-500 text-sm font-medium">
                {'★'.repeat(project.priority)}
              </div>
            )}
          </div>
          <p className="text-sm text-yellow-500 font-medium mb-2">
            {project.category}
          </p>
          <p className="text-gray-400 text-sm line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Tecnologie */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-gray-800 text-gray-300 rounded-md text-xs"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded-md text-xs">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-500 transition-colors"
                title="Demo Live"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </a>
            )}
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-500 transition-colors"
                title="Repository"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.56v-2c-3.2.7-3.87-1.55-3.87-1.55-.52-1.3-1.28-1.65-1.28-1.65-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.72-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.45.11-3.01 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.56.23 2.72.11 3.01.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.41.36.77 1.08.77 2.18v3.24c0 .31.21.67.79.56A11.52 11.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/>
                </svg>
              </a>
            )}
          </div>
          
          {/* Link dettagli */}
          <Link
            href={`/projects/${project.slug}`}
            className="text-yellow-500 hover:text-yellow-400 text-sm font-medium transition-colors"
          >
            Dettagli →
          </Link>
        </div>

        {/* Data */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            {new Date(project.createdAt).toLocaleDateString('it-IT', {
              year: 'numeric',
              month: 'long'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}