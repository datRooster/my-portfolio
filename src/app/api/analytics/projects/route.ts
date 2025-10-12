import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/database/prisma';

export async function GET() {
  try {
    // Verifica autenticazione admin (semplificata per development)
    try {
      await requireAdmin();
    } catch (authError) {
      // Per development, saltiamo l'autenticazione
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Skipping auth in development mode');
      } else {
        throw authError;
      }
    }
    // Statistiche base sui progetti
    const [
      totalProjects,
      inProgressProjects,
      completedProjects,
      draftProjects,
      archivedProjects,
      featuredProjects
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.project.count({ where: { status: 'COMPLETED' } }),
      prisma.project.count({ where: { status: 'DRAFT' } }),
      prisma.project.count({ where: { status: 'ARCHIVED' } }),
      prisma.project.count({ where: { featured: true } })
    ]);

    // Progetti per categoria
    const projectsByCategory = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        color: true,
        icon: true,
        _count: {
          select: {
            projects: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Top tecnologie usate
    const topTechnologies = await prisma.technology.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
        _count: {
          select: {
            projects: true
          }
        }
      },
      orderBy: {
        projects: {
          _count: 'desc'
        }
      },
      take: 10
    });

    // Top competenze usate
    const topSkills = await prisma.skill.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        _count: {
          select: {
            projects: true
          }
        }
      },
      orderBy: {
        projects: {
          _count: 'desc'
        }
      },
      take: 10
    });

    // Progetti per priorità
    const projectsByPriority = await prisma.project.groupBy({
      by: ['priority'],
      _count: {
        priority: true
      },
      orderBy: {
        priority: 'asc'
      }
    });

    // Progetti creati negli ultimi 6 mesi (per grafico temporale)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const projectsTimeline = await prisma.project.groupBy({
      by: ['createdAt'],
      _count: {
        createdAt: true
      },
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Progetti per stato nel tempo (ultimi 30 giorni)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentProjects = await prisma.project.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        priority: true,
        featured: true,
        category: {
          select: {
            name: true,
            color: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Statistiche avanzate
    const avgProjectsPerCategory = totalProjects > 0 ? 
      Math.round((totalProjects / Math.max(projectsByCategory.length, 1)) * 100) / 100 : 0;

    const completionRate = totalProjects > 0 ? 
      Math.round((completedProjects / totalProjects) * 100) : 0;

    const featuredRate = totalProjects > 0 ? 
      Math.round((featuredProjects / totalProjects) * 100) : 0;

    // Calcola distribuzione dei progetti per mese
    const monthlyDistribution = projectsTimeline.reduce((acc, item) => {
      const month = new Date(item.createdAt).toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + item._count.createdAt;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      summary: {
        totalProjects,
        activeProjects: inProgressProjects,
        completedProjects,
        draftProjects,
        archivedProjects,
        inDevelopmentProjects: inProgressProjects,
        featuredProjects,
        completionRate,
        featuredRate,
        avgProjectsPerCategory
      },
      distribution: {
        byCategory: projectsByCategory.map(cat => ({
          id: cat.id,
          name: cat.name,
          color: cat.color,
          icon: cat.icon,
          count: cat._count.projects,
          percentage: totalProjects > 0 ? Math.round((cat._count.projects / totalProjects) * 100) : 0
        })),
        byPriority: projectsByPriority.map(item => ({
          priority: item.priority,
          count: item._count.priority,
          percentage: totalProjects > 0 ? Math.round((item._count.priority / totalProjects) * 100) : 0
        })),
        byStatus: [
          { status: 'IN_PROGRESS', count: inProgressProjects, label: 'In Corso' },
          { status: 'COMPLETED', count: completedProjects, label: 'Completato' },
          { status: 'DRAFT', count: draftProjects, label: 'Bozza' },
          { status: 'ARCHIVED', count: archivedProjects, label: 'Archiviato' }
        ].map(item => ({
          ...item,
          percentage: totalProjects > 0 ? Math.round((item.count / totalProjects) * 100) : 0
        }))
      },
      topTechnologies: topTechnologies.map(tech => ({
        id: tech.id,
        name: tech.name,
        icon: tech.icon,
        color: tech.color,
        projectCount: tech._count.projects,
        percentage: totalProjects > 0 ? Math.round((tech._count.projects / totalProjects) * 100) : 0
      })),
      topSkills: topSkills.map(skill => ({
        id: skill.id,
        name: skill.name,
        icon: null,
        color: null,
        projectCount: skill._count.projects,
        percentage: totalProjects > 0 ? Math.round((skill._count.projects / totalProjects) * 100) : 0
      })),
      timeline: {
        monthlyDistribution,
        recentProjects: recentProjects.map(project => ({
          id: project.id,
          title: project.title,
          status: project.status,
          priority: project.priority,
          featured: project.featured,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          category: project.category
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching project analytics:', error);
    
    // Se è un errore di autenticazione, restituisci 403
    if (error instanceof Error && error.message.includes('admin')) {
      return NextResponse.json(
        { error: 'Accesso admin richiesto' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}