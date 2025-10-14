import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';

export const runtime = 'nodejs';

// GET /api/testimonials - Lista testimonial pubblici
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filtri
    const featured = searchParams.get('featured') === 'true';
    const serviceId = searchParams.get('serviceId');
    const projectId = searchParams.get('projectId');
    // const showOnHomepage = searchParams.get('homepage') === 'true';
    
    // Paginazione
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Costruisci where clause
    const where: any = {
      approved: true // Solo testimonial approvati
    };
    
    if (featured) where.featured = true;
    if (serviceId) where.serviceId = serviceId;
    if (projectId) where.projectId = projectId;
    
    // Query
    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: [
          { featured: 'desc' },
          { rating: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
        include: {
          service: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          project: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          }
        }
      }),
      prisma.testimonial.count({ where })
    ]);
    
    // Metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return NextResponse.json({
      testimonials,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      }
    });
    
  } catch (error) {
    console.error('Errore nel recupero testimonial:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// POST /api/testimonials - Crea nuovo testimonial
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validazione
    if (!data.clientName || !data.content) {
      return NextResponse.json(
        { error: 'Nome cliente e contenuto sono obbligatori' },
        { status: 400 }
      );
    }
    
    // Validazione rating
    const rating = parseInt(data.rating) || 5;
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating deve essere tra 1 e 5' },
        { status: 400 }
      );
    }
    
    // Verifica servizio o progetto se specificati
    if (data.serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: data.serviceId }
      });
      if (!service) {
        return NextResponse.json(
          { error: 'Servizio non trovato' },
          { status: 404 }
        );
      }
    }
    
    if (data.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: data.projectId }
      });
      if (!project) {
        return NextResponse.json(
          { error: 'Progetto non trovato' },
          { status: 404 }
        );
      }
    }
    
    // Crea testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        clientName: data.clientName,
        clientRole: data.clientRole,
        company: data.company,
        avatar: data.avatar,
        content: data.content,
        rating: rating,
        projectType: data.projectType,
        serviceId: data.serviceId,
        projectId: data.projectId,
        featured: data.featured || false,
        approved: data.approved || false // Default non approvato per revisione
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    });
    
    return NextResponse.json(testimonial, { status: 201 });
    
  } catch (error) {
    console.error('Errore nella creazione testimonial:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}