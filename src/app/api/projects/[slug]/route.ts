import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Tipo per il progetto con le sue relazioni come vengono ritornate da Prisma
type ProjectWithRelations = Awaited<ReturnType<typeof prisma.project.findFirst<{
  include: {
    category: true;
    technologies: {
      include: {
        technology: true;
      };
    };
    skills: {
      include: {
        skill: true;
      };
    };
  };
}>>>;

// Funzione per convertire il progetto Prisma nel formato legacy
function formatProject(project: NonNullable<ProjectWithRelations>) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    longDescription: project.longDescription,
    status: project.status.toLowerCase().replace('_', '-'),
    category: project.category.name,
    priority: project.priority,
    startDate: project.startDate.toISOString(),
    endDate: project.endDate?.toISOString(),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    featuredImage: project.featuredImage,
    gallery: project.gallery,
    screenshots: project.screenshots,
    technologies: project.technologies.map((tech) => tech.technology.name),
    skills: project.skills.map((skill) => skill.skill.name),
    demoUrl: project.demoUrl,
    repositoryUrl: project.repositoryUrl,
    caseStudyUrl: project.caseStudyUrl,
    slug: project.slug,
    tags: project.tags,
    featured: project.featured,
    role: project.role,
    client: project.client,
    team: project.team,
    metrics: project.metrics
  };
}
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    
    // Trova progetto per slug nel database
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        category: true,
        technologies: {
          include: {
            technology: true
          },
          orderBy: {
            importance: 'desc'
          }
        },
        skills: {
          include: {
            skill: true
          }
        }
      }
    });
    
    if (!project) {
      return NextResponse.json(
        { error: 'Progetto non trovato' },
        { status: 404 }
      );
    }

    // Formatta il progetto nel formato legacy
    const formattedProject = formatProject(project);

    return NextResponse.json({ project: formattedProject });

  } catch (error) {
    console.error('Errore API progetto singolo:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}