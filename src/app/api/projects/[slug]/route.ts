import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { writeJsonValue, writeStringArray } from '@/lib/database/mysql-json';
import { normalizeProjectCollections } from '@/lib/database/serializers';
import { withAdminAuth } from '@/lib/auth';
import { ProjectStatus } from '@prisma/client';

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

// Funzione per convertire il progetto Prisma nel formato legacy
function formatProject(project: NonNullable<ProjectWithRelations>) {
  const normalizedProject = normalizeProjectCollections(project);

  return {
    id: normalizedProject.id,
    title: normalizedProject.title,
    description: normalizedProject.description,
    longDescription: normalizedProject.longDescription,
    status: mapStatusToFrontend(normalizedProject.status),
    category: normalizedProject.category.name,
    priority: normalizedProject.priority,
    startDate: normalizedProject.startDate.toISOString(),
    endDate: normalizedProject.endDate?.toISOString(),
    createdAt: normalizedProject.createdAt.toISOString(),
    updatedAt: normalizedProject.updatedAt.toISOString(),
    featuredImage: normalizedProject.featuredImage,
    gallery: normalizedProject.gallery,
    screenshots: normalizedProject.screenshots,
    technologies: normalizedProject.technologies.map((tech) => tech.technology.name),
    skills: normalizedProject.skills.map((skill) => skill.skill.name),
    demoUrl: normalizedProject.demoUrl,
    repositoryUrl: normalizedProject.repositoryUrl,
    caseStudyUrl: normalizedProject.caseStudyUrl,
    slug: normalizedProject.slug,
    tags: normalizedProject.tags,
    featured: normalizedProject.featured,
    role: normalizedProject.role,
    client: normalizedProject.client,
    team: normalizedProject.team,
    metrics: normalizedProject.metrics
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return withAdminAuth(async () => {
    const { slug } = await params;
    try {
      
      // Verifica che il progetto esista
      const existingProject = await prisma.project.findUnique({
        where: { slug }
      });
      
      if (!existingProject) {
        return NextResponse.json(
          { error: 'Progetto non trovato' },
          { status: 404 }
        );
      }

      // Elimina le relazioni prima di eliminare il progetto
      await prisma.projectTechnology.deleteMany({
        where: { projectId: existingProject.id }
      });

      await prisma.projectSkill.deleteMany({
        where: { projectId: existingProject.id }
      });

      // Elimina il progetto
      await prisma.project.delete({
        where: { slug }
      });

      return NextResponse.json({ 
        message: 'Progetto eliminato con successo',
        deletedProject: { id: existingProject.id, slug: existingProject.slug }
      });

    } catch (error) {
      console.error('Errore eliminazione progetto:', error);
      return NextResponse.json(
        { error: 'Errore interno del server durante l\'eliminazione' },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return withAdminAuth(async () => {
    const { slug } = await params;
    try {
      const body = await request.json();
      
      // Verifica che il progetto esista
      const existingProject = await prisma.project.findUnique({
        where: { slug }
      });
      
      if (!existingProject) {
        return NextResponse.json(
          { error: 'Progetto non trovato' },
          { status: 404 }
        );
      }

      // Funzione per mappare status frontend -> database
      const mapStatusToDb = (frontendStatus: string): ProjectStatus => {
        const statusMap: Record<string, ProjectStatus> = {
          'draft': ProjectStatus.DRAFT,
          'active': ProjectStatus.IN_PROGRESS,
          'completed': ProjectStatus.COMPLETED, 
          'archived': ProjectStatus.ARCHIVED
        };
        return statusMap[frontendStatus] || ProjectStatus.DRAFT;
      };

      // Aggiorna il progetto (per ora con campi base)
      const updatedProject = await prisma.project.update({
        where: { slug },
        data: {
          title: body.title,
          description: body.description,
          longDescription: body.longDescription,
          status: body.status ? mapStatusToDb(body.status) : existingProject.status,
          priority: body.priority || existingProject.priority,
          featured: body.featured ?? existingProject.featured,
          demoUrl: body.liveUrl || body.demoUrl,
          repositoryUrl: body.githubUrl || body.repositoryUrl,
          featuredImage: body.imageUrl || body.featuredImage,
          caseStudyUrl: body.caseStudyUrl,
          role: body.role,
          client: body.client,
          ...(body.gallery !== undefined ? { gallery: writeStringArray(body.gallery) } : {}),
          ...(body.screenshots !== undefined ? { screenshots: writeStringArray(body.screenshots) } : {}),
          ...(body.tags !== undefined ? { tags: writeStringArray(body.tags) } : {}),
          ...(body.team !== undefined ? { team: writeStringArray(body.team) } : {}),
          ...(body.metrics !== undefined ? { metrics: writeJsonValue(body.metrics) } : {}),
          updatedAt: new Date()
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

      // Formatta il progetto aggiornato
      const formattedProject = formatProject(updatedProject);

      return NextResponse.json({ 
        message: 'Progetto aggiornato con successo',
        project: formattedProject
      });

    } catch (error) {
      console.error('Errore aggiornamento progetto:', error);
      return NextResponse.json(
        { error: 'Errore interno del server durante l\'aggiornamento' },
        { status: 500 }
      );
    }
  });
}
