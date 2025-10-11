import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { withAdminAuth } from '@/lib/auth';
import { ProjectStatus } from '@prisma/client';

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

// Funzione per mappare status frontend -> database
function mapStatusToDb(frontendStatus: string): ProjectStatus {
  const statusMap: Record<string, ProjectStatus> = {
    'draft': ProjectStatus.DRAFT,
    'active': ProjectStatus.IN_PROGRESS,
    'completed': ProjectStatus.COMPLETED, 
    'archived': ProjectStatus.ARCHIVED
  };
  return statusMap[frontendStatus] || ProjectStatus.DRAFT;
}

// Funzione per mappare status database -> frontend
function mapStatusToFrontend(dbStatus: ProjectStatus): 'draft' | 'active' | 'completed' | 'archived' {
  const statusMap: Record<ProjectStatus, 'draft' | 'active' | 'completed' | 'archived'> = {
    [ProjectStatus.DRAFT]: 'draft',
    [ProjectStatus.IN_PROGRESS]: 'active',
    [ProjectStatus.COMPLETED]: 'completed',
    [ProjectStatus.ARCHIVED]: 'archived'
  };
  return statusMap[dbStatus] || 'draft';
}

// Funzione per convertire il progetto Prisma nel formato legacy per compatibilità frontend
function formatProject(project: ProjectWithRelations) {
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    shortDescription: project.description.substring(0, 150) + '...', // Tronca per compatibilità
    githubUrl: project.repositoryUrl, // Mapping campo
    liveUrl: project.demoUrl, // Mapping campo  
    imageUrl: project.featuredImage, // Mapping campo
    featured: project.featured,
    status: mapStatusToFrontend(project.status),
    priority: project.priority,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    categories: [project.category.name], // Converte singola categoria in array
    technologies: project.technologies.map((tech) => tech.technology.name),
    // Nuovi campi per compatibilità futura
    longDescription: project.longDescription,
    category: project.category.name,
    skills: project.skills.map((skill) => skill.skill.name),
    tags: project.tags,
    role: project.role,
    client: project.client,
    team: project.team,
    metrics: project.metrics,
    demoUrl: project.demoUrl,
    repositoryUrl: project.repositoryUrl,
    caseStudyUrl: project.caseStudyUrl,
    startDate: project.startDate.toISOString(),
    endDate: project.endDate?.toISOString(),
    featuredImage: project.featuredImage,
    gallery: project.gallery,
    screenshots: project.screenshots
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
    const formattedProjects = projects.map((project) => formatProject(project));

    return NextResponse.json({
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

export async function POST(request: NextRequest) {
  return withAdminAuth(async (user) => {
    try {
      const body = await request.json();
      
      // Validazione campi obbligatori
      if (!body.title || !body.description) {
        return NextResponse.json(
          { error: 'Titolo e descrizione sono obbligatori' },
          { status: 400 }
        );
      }

      // Genera slug dal titolo se non fornito
      const slug = body.slug || body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Verifica che lo slug sia unico
      const existingProject = await prisma.project.findUnique({
        where: { slug }
      });

      if (existingProject) {
        return NextResponse.json(
          { error: 'Esiste già un progetto con questo slug' },
          { status: 409 }
        );
      }

      // Trova o crea categoria (per semplicità assumiamo che esista)
      let categoryId = '1'; // Default category ID come stringa
      if (body.category) {
        const category = await prisma.category.findFirst({
          where: { name: body.category }
        });
        if (category) {
          categoryId = category.id;
        }
      }

      // Crea il progetto
      const newProject = await prisma.project.create({
        data: {
          title: body.title,
          slug,
          description: body.description,
          longDescription: body.longDescription || body.description,
          status: body.status ? mapStatusToDb(body.status) : ProjectStatus.DRAFT,
          priority: body.priority || 0,
          featured: body.featured || false,
          demoUrl: body.liveUrl || body.demoUrl,
          repositoryUrl: body.githubUrl || body.repositoryUrl,
          featuredImage: body.imageUrl || body.featuredImage,
          caseStudyUrl: body.caseStudyUrl,
          role: body.role,
          client: body.client,
          tags: body.tags || [],
          startDate: body.startDate ? new Date(body.startDate) : new Date(),
          endDate: body.endDate ? new Date(body.endDate) : null,
          categoryId,
          gallery: body.gallery || [],
          screenshots: body.screenshots || []
        },
        include: {
          category: true,
          technologies: {
            include: {
              technology: true
            }
          },
          skills: {
            include: {
              skill: true
            }
          }
        }
      });

      // Formatta il progetto creato
      const formattedProject = formatProject(newProject);

      return NextResponse.json({ 
        message: 'Progetto creato con successo',
        project: formattedProject
      }, { status: 201 });

    } catch (error) {
      console.error('Errore creazione progetto:', error);
      return NextResponse.json(
        { error: 'Errore interno del server durante la creazione' },
        { status: 500 }
      );
    }
  });
}
