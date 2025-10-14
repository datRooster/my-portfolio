import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { InquiryStatus, InquiryPriority } from '@prisma/client';

export const runtime = 'nodejs';

// GET /api/services/inquiries/[id] - Dettaglio richiesta (admin only)
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const inquiry = await prisma.serviceInquiry.findUnique({
      where: { id },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            category: true,
            slug: true
          }
        },
        responses: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!inquiry) {
      return NextResponse.json(
        { error: 'Richiesta non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(inquiry);
    
  } catch (error) {
    console.error('Errore nel recupero richiesta:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// PUT /api/services/inquiries/[id] - Aggiorna richiesta (admin only)
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const data = await request.json();
    
    // Verifica che la richiesta esista
    const existingInquiry = await prisma.serviceInquiry.findUnique({
      where: { id }
    });
    
    if (!existingInquiry) {
      return NextResponse.json(
        { error: 'Richiesta non trovata' },
        { status: 404 }
      );
    }
    
    // Aggiorna la richiesta
    const updatedInquiry = await prisma.serviceInquiry.update({
      where: { id },
      data: {
        status: data.status || existingInquiry.status,
        priority: data.priority || existingInquiry.priority,
        notes: data.notes !== undefined ? data.notes : existingInquiry.notes,
        response: data.response !== undefined ? data.response : existingInquiry.response,
        respondedAt: data.response && !existingInquiry.respondedAt ? new Date() : existingInquiry.respondedAt
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            category: true,
            slug: true
          }
        }
      }
    });
    
    return NextResponse.json(updatedInquiry);
    
  } catch (error) {
    console.error('Errore nell\'aggiornamento richiesta:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// DELETE /api/services/inquiries/[id] - Elimina richiesta (admin only)
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    // Verifica che la richiesta esista
    const existingInquiry = await prisma.serviceInquiry.findUnique({
      where: { id }
    });
    
    if (!existingInquiry) {
      return NextResponse.json(
        { error: 'Richiesta non trovata' },
        { status: 404 }
      );
    }
    
    // Elimina la richiesta (cascading delete gestito da Prisma)
    await prisma.serviceInquiry.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { message: 'Richiesta eliminata con successo' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Errore nell\'eliminazione richiesta:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}