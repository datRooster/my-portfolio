import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { writeStringArray } from '@/lib/database/mysql-json';
import { normalizeServiceCollections } from '@/lib/database/serializers';
import {
  Prisma,
  ServiceStatus,
  ServiceCategory,
  ServiceType,
} from '@prisma/client';

export const runtime = 'nodejs';

type ServiceWithSummary = Awaited<ReturnType<typeof prisma.service.findMany<{
  include: {
    testimonials: true;
    _count: {
      select: {
        inquiries: true;
        testimonials: true;
      };
    };
  };
}>>>[number];

function toCategorySlug(category: string) {
  return category.toLowerCase().replace(/_/g, '-');
}

function toNumericPrice(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'toNumber' in value &&
    typeof value.toNumber === 'function'
  ) {
    return value.toNumber();
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatServiceForList(service: ServiceWithSummary) {
  const normalizedService = normalizeServiceCollections(service);
  const reviewCount = normalizedService.testimonials.length;
  const averageRating = reviewCount > 0
    ? normalizedService.testimonials.reduce(
        (total: number, testimonial: { rating: number }) => total + testimonial.rating,
        0
      ) / reviewCount
    : 0;
  const startingPrice = toNumericPrice(
    normalizedService.basePrice ?? normalizedService.price ?? normalizedService.maxPrice
  );

  return {
    ...normalizedService,
    title: normalizedService.title || normalizedService.name,
    shortDescription:
      normalizedService.description.length > 160
        ? `${normalizedService.description.slice(0, 157)}...`
        : normalizedService.description,
    category: toCategorySlug(normalizedService.category),
    isActive: normalizedService.status === 'ACTIVE' && normalizedService.available,
    averageRating,
    reviewCount,
    completedProjects: normalizedService._count.testimonials,
    estimatedDelivery: normalizedService.duration || 'Su richiesta',
    packages: startingPrice
      ? [
          {
            id: `${normalizedService.id}-base`,
            name: normalizedService.title || normalizedService.name,
            price: startingPrice,
            features: normalizedService.features,
            deliveryTime: normalizedService.duration || 'Su richiesta',
          },
        ]
      : [],
  };
}

// GET /api/services - Lista tutti i servizi con filtri e paginazione
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parametri di filtro
    const status = searchParams.get('status') as ServiceStatus | null;
    const category = searchParams.get('category') as ServiceCategory | null;
    const type = searchParams.get('type') as ServiceType | null;
    const featured = searchParams.get('featured') === 'true';
    const available = searchParams.get('available') !== 'false'; // Default true
    
    // Parametri di paginazione
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Costruisci il where clause
    const where: Prisma.ServiceWhereInput = {
      available: available,
    };
    
    if (status) where.status = status;
    if (category) where.category = category;
    if (type) where.type = type;
    if (featured) where.featured = true;
    
    // Query con filtri e paginazione
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy: [
          { featured: 'desc' },
          { order: 'asc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
        include: {
          testimonials: {
            where: { approved: true },
            take: 3,
            orderBy: { rating: 'desc' }
          },
          _count: {
            select: {
              inquiries: true,
              testimonials: true
            }
          }
        }
      }),
      prisma.service.count({ where })
    ]);
    
    // Metadata per paginazione
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return NextResponse.json({
      services: services.map((service) => formatServiceForList(service)),
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
    console.error('Errore nel recupero servizi:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// POST /api/services - Crea un nuovo servizio (admin only)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validazione base dei campi obbligatori
    if (!data.name || !data.description) {
      return NextResponse.json(
        { error: 'Nome e descrizione sono obbligatori' },
        { status: 400 }
      );
    }
    
    // Genera slug se non fornito
    if (!data.slug) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Verifica che lo slug sia unico
    const existingService = await prisma.service.findUnique({
      where: { slug: data.slug }
    });
    
    if (existingService) {
      return NextResponse.json(
        { error: 'Esiste già un servizio con questo slug' },
        { status: 409 }
      );
    }
    
    // Crea il servizio
    const service = await prisma.service.create({
      data: {
        name: data.name,
        title: data.title,
        description: data.description,
        longDescription: data.longDescription,
        category: data.category || 'WEB_DEVELOPMENT',
        type: data.type || 'CONSULTING',
        duration: data.duration,
        pricing: data.pricing || 'CUSTOM',
        price: data.price ? parseFloat(data.price) : null,
        basePrice: data.basePrice ? parseFloat(data.basePrice) : null,
        maxPrice: data.maxPrice ? parseFloat(data.maxPrice) : null,
        currency: data.currency || 'EUR',
        status: data.status || 'ACTIVE',
        featured: data.featured || false,
        available: data.available !== false,
        order: data.order || 0,
        features: writeStringArray(data.features),
        deliverables: writeStringArray(data.deliverables),
        requirements: writeStringArray(data.requirements),
        icon: data.icon,
        image: data.image,
        gallery: writeStringArray(data.gallery),
        slug: data.slug,
        tags: writeStringArray(data.tags)
      },
      include: {
        testimonials: true,
        _count: {
          select: {
            inquiries: true,
            testimonials: true
          }
        }
      }
    });
    
    return NextResponse.json(normalizeServiceCollections(service), { status: 201 });
    
  } catch (error) {
    console.error('Errore nella creazione servizio:', error);
    
    // Gestisci errori specifici di Prisma
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Slug già esistente' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
