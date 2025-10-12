import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types/project';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    // Importa direttamente la logica API invece di fare fetch
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        category: true,
        technologies: {
          include: {
            technology: true
          }
        }
      }
    });
    
    await prisma.$disconnect();
    return project;
  } catch (error) {
    console.error('Errore caricamento progetto:', error);
    return null;
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  
  if (!project) {
    notFound();
  }

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
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link 
              href="/projects" 
              className="text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              ← Torna ai progetti
            </Link>
          </nav>

          {/* Hero del progetto */}
          <div className="mb-12">
            <div className="flex flex-wrap items-start gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-extrabold flex-1">
                {project.title}
              </h1>
              <div className="flex gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status]}`}>
                  {statusLabels[project.status]}
                </span>
                {project.featured && (
                  <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                    ⭐ In Evidenza
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-lg text-yellow-500 font-medium mb-4">
              {project.category}
            </p>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Immagine principale */}
          {project.featuredImage && (
            <div className="relative h-96 mb-12 rounded-xl overflow-hidden">
              <Image
                src={project.featuredImage}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Info e Links */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              {/* Descrizione dettagliata */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Descrizione</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    {project.longDescription || project.description}
                  </p>
                </div>
              </div>

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.gallery.map((image, index) => (
                      <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`${project.title} - Screenshot ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Links */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="font-bold mb-4">Links</h3>
                <div className="space-y-3">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-medium"
                    >
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Demo Live
                    </a>
                  )}
                  {project.repositoryUrl && (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.56v-2c-3.2.7-3.87-1.55-3.87-1.55-.52-1.3-1.28-1.65-1.28-1.65-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.72-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.45.11-3.01 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.56.23 2.72.11 3.01.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.41.36.77 1.08.77 2.18v3.24c0 .31.21.67.79.56A11.52 11.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/>
                      </svg>
                      Repository
                    </a>
                  )}
                  {project.caseStudyUrl && (
                    <a
                      href={project.caseStudyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      📄 Case Study
                    </a>
                  )}
                </div>
              </div>

              {/* Tecnologie */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="font-bold mb-4">Tecnologie</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dettagli */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="font-bold mb-4">Dettagli</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Data inizio:</span>
                    <br />
                    <span>{new Date(project.startDate).toLocaleDateString('it-IT')}</span>
                  </div>
                  {project.endDate && (
                    <div>
                      <span className="text-gray-400">Data fine:</span>
                      <br />
                      <span>{new Date(project.endDate).toLocaleDateString('it-IT')}</span>
                    </div>
                  )}
                  {project.role && (
                    <div>
                      <span className="text-gray-400">Ruolo:</span>
                      <br />
                      <span>{project.role}</span>
                    </div>
                  )}
                  {project.client && (
                    <div>
                      <span className="text-gray-400">Cliente:</span>
                      <br />
                      <span>{project.client}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metriche */}
              {project.metrics && (
                <div className="bg-gray-900 rounded-xl p-6">
                  <h3 className="font-bold mb-4">Metriche</h3>
                  <div className="space-y-2 text-sm">
                    {project.metrics.users && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Utenti:</span>
                        <span>{project.metrics.users.toLocaleString()}</span>
                      </div>
                    )}
                    {project.metrics.downloads && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Download:</span>
                        <span>{project.metrics.downloads.toLocaleString()}</span>
                      </div>
                    )}
                    {project.metrics.stars && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stars:</span>
                        <span>{project.metrics.stars.toLocaleString()}</span>
                      </div>
                    )}
                    {project.metrics.performance && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Performance:</span>
                        <span>{project.metrics.performance}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}