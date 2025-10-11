import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Tipo per il progetto con le sue relazioni come vengono ritornate da Prisma
type ProjectWithRelations = Awaited<ReturnType<typeof prisma.project.findMany<{
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
}>>>[0];

// Funzione per convertire il progetto Prisma nel formato legacy
function formatProject(project: ProjectWithRelations) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    longDescription: project.longDescription,
    status: project.status.toLowerCase().replace('_', '-'), // COMPLETED -> completed
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parametri di query
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const technologies = searchParams.get('technologies')?.split(',');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // Costruisci where clause per Prisma
    const where: Record<string, unknown> = {};

    if (category) {
      where.category = {
        name: category
      };
    }

    if (status) {
      // Converti da formato frontend a database
      const dbStatus = status.toUpperCase().replace('-', '_');
      where.status = dbStatus;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (technologies && technologies.length > 0) {
      where.technologies = {
        some: {
          technology: {
            name: {
              in: technologies
            }
          }
        }
      };
    }

    // Query con relazioni
    const projects = await prisma.project.findMany({
      where,
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
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: (page - 1) * pageSize,
      take: pageSize
    });

    // Count totale per paginazione
    const total = await prisma.project.count({ where });

    // Formatta i progetti per compatibilità con il frontend esistente
    const formattedProjects = projects.map((project) => formatProject(project));    return NextResponse.json({
      projects: formattedProjects,
      total,
      page,
      pageSize,
      hasMore: (page * pageSize) < total
    });

  } catch (error) {
    console.error('Errore API progetti:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}