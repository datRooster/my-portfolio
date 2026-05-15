import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';

export const runtime = 'nodejs';

// GET /api/services/[slug] - Dettaglio servizio
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  try {
    const service = await prisma.service.findUnique({
      where: { slug },
      include: {
        testimonials: {
          where: { approved: true },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            project: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        inquiries: {
          select: {
            id: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            testimonials: { where: { approved: true } },
            inquiries: true
          }
        }
      }
    });
    
    if (!service) {
      return NextResponse.json(
        { error: 'Servizio non trovato' },
        { status: 404 }
      );
    }
    
    // Se il servizio non è disponibile o attivo, restituiscilo solo agli admin
    if (service.status !== 'ACTIVE' || !service.available) {
      // Per ora restituiamo sempre il servizio
      // In futuro qui dovremmo controllare i permessi admin
    }
    
    return NextResponse.json(service);
    
  } catch (error) {
    console.error('Errore nel recupero servizio:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// PUT /api/services/[slug] - Aggiorna servizio (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  try {
    const data = await request.json();
    
    // Verifica che il servizio esista
    const existingService = await prisma.service.findUnique({
      where: { slug }
    });
    
    if (!existingService) {
      return NextResponse.json(
        { error: 'Servizio non trovato' },
        { status: 404 }
      );
    }
    
    // Se viene cambiato lo slug, verifica che non esista già
    if (data.slug && data.slug !== existingService.slug) {
      const slugExists = await prisma.service.findUnique({
        where: { slug: data.slug }
      });
      
      if (slugExists) {
        return NextResponse.json(
          { error: 'Esiste già un servizio con questo slug' },
          { status: 400 }
        );
      }
    }
    
    // Validazione pricing
    if (data.pricing === 'FIXED' && !data.price && !data.basePrice) {
      return NextResponse.json(
        { error: 'Prezzo obbligatorio per servizi a prezzo fisso' },
        { status: 400 }
      );
    }
    
    // Aggiorna il servizio
    const updatedService = await prisma.service.update({
      where: { slug },
      data: {
        name: data.name || existingService.name,
        title: data.title !== undefined ? data.title : existingService.title,
        description: data.description || existingService.description,
        longDescription: data.longDescription !== undefined ? data.longDescription : existingService.longDescription,
        category: data.category || existingService.category,
        type: data.type || existingService.type,
        duration: data.duration !== undefined ? data.duration : existingService.duration,
        pricing: data.pricing || existingService.pricing,
        price: data.price !== undefined ? data.price : existingService.price,
        basePrice: data.basePrice !== undefined ? data.basePrice : existingService.basePrice,
        maxPrice: data.maxPrice !== undefined ? data.maxPrice : existingService.maxPrice,
        currency: data.currency || existingService.currency,
        status: data.status || existingService.status,
        featured: data.featured !== undefined ? data.featured : existingService.featured,
        available: data.available !== undefined ? data.available : existingService.available,
        order: data.order !== undefined ? data.order : existingService.order,
        features: data.features !== undefined ? data.features : existingService.features,
        deliverables: data.deliverables !== undefined ? data.deliverables : existingService.deliverables,
        requirements: data.requirements !== undefined ? data.requirements : existingService.requirements,
        icon: data.icon !== undefined ? data.icon : existingService.icon,
        image: data.image !== undefined ? data.image : existingService.image,
        gallery: data.gallery !== undefined ? data.gallery : existingService.gallery,
        slug: data.slug !== undefined ? data.slug : existingService.slug,
        tags: data.tags !== undefined ? data.tags : existingService.tags
      }
    });
    
    return NextResponse.json(updatedService);
    
  } catch (error) {
    console.error('Errore nell\'aggiornamento servizio:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[slug] - Elimina servizio (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  try {
    // Verifica che il servizio esista
    const existingService = await prisma.service.findUnique({
      where: { slug }
    });
    
    if (!existingService) {
      return NextResponse.json(
        { error: 'Servizio non trovato' },
        { status: 404 }
      );
    }
    
    // Elimina il servizio (cascading delete gestito da Prisma)
    await prisma.service.delete({
      where: { slug }
    });
    
    return NextResponse.json(
      { message: 'Servizio eliminato con successo' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Errore nell\'eliminazione servizio:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}