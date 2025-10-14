import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';

export const runtime = 'nodejs';

// GET /api/testimonials/[id] - Dettaglio testimonial
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
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
    
    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial non trovato' },
        { status: 404 }
      );
    }
    
    // Se non è approvato, mostralo solo agli admin
    if (!testimonial.approved) {
      // Per ora restituiamo sempre il testimonial
      // In futuro qui dovremmo controllare i permessi admin
    }
    
    return NextResponse.json(testimonial);
    
  } catch (error) {
    console.error('Errore nel recupero testimonial:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// PUT /api/testimonials/[id] - Aggiorna testimonial (admin only)
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const data = await request.json();
    
    // Verifica che il testimonial esista
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    });
    
    if (!existingTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial non trovato' },
        { status: 404 }
      );
    }
    
    // Validazione rating
    if (data.rating && (data.rating < 1 || data.rating > 5)) {
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
    
    // Aggiorna il testimonial
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        clientName: data.clientName || existingTestimonial.clientName,
        clientRole: data.clientRole !== undefined ? data.clientRole : existingTestimonial.clientRole,
        company: data.company !== undefined ? data.company : existingTestimonial.company,
        avatar: data.avatar !== undefined ? data.avatar : existingTestimonial.avatar,
        content: data.content || existingTestimonial.content,
        rating: data.rating || existingTestimonial.rating,
        projectType: data.projectType !== undefined ? data.projectType : existingTestimonial.projectType,
        serviceId: data.serviceId !== undefined ? data.serviceId : existingTestimonial.serviceId,
        projectId: data.projectId !== undefined ? data.projectId : existingTestimonial.projectId,
        featured: data.featured !== undefined ? data.featured : existingTestimonial.featured,
        approved: data.approved !== undefined ? data.approved : existingTestimonial.approved
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
    
    return NextResponse.json(updatedTestimonial);
    
  } catch (error) {
    console.error('Errore nell\'aggiornamento testimonial:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// DELETE /api/testimonials/[id] - Elimina testimonial (admin only)
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    // Verifica che il testimonial esista
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    });
    
    if (!existingTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial non trovato' },
        { status: 404 }
      );
    }
    
    // Elimina il testimonial
    await prisma.testimonial.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { message: 'Testimonial eliminato con successo' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Errore nell\'eliminazione testimonial:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}