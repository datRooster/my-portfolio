import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';

export const runtime = 'nodejs';

// POST /api/services/inquiries/[id]/responses - Aggiungi risposta (admin only)
export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const data = await request.json();
    
    // Verifica che la richiesta esista
    const inquiry = await prisma.serviceInquiry.findUnique({
      where: { id }
    });
    
    if (!inquiry) {
      return NextResponse.json(
        { error: 'Richiesta non trovata' },
        { status: 404 }
      );
    }
    
    // Validazione
    if (!data.content) {
      return NextResponse.json(
        { error: 'Contenuto risposta obbligatorio' },
        { status: 400 }
      );
    }
    
    // Crea la risposta
    const response = await prisma.inquiryResponse.create({
      data: {
        content: data.content,
        isInternal: data.isInternal || false,
        author: data.author || 'Admin',
        inquiryId: id
      }
    });
    
    // Aggiorna la richiesta se non è interna
    if (!data.isInternal) {
      await prisma.serviceInquiry.update({
        where: { id },
        data: {
          response: data.content,
          respondedAt: new Date(),
          status: 'RESPONDED'
        }
      });
    }
    
    return NextResponse.json(response, { status: 201 });
    
  } catch (error) {
    console.error('Errore nella creazione risposta:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// GET /api/services/inquiries/[id]/responses - Lista risposte (admin only)
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    // Verifica che la richiesta esista
    const inquiry = await prisma.serviceInquiry.findUnique({
      where: { id }
    });
    
    if (!inquiry) {
      return NextResponse.json(
        { error: 'Richiesta non trovata' },
        { status: 404 }
      );
    }
    
    const responses = await prisma.inquiryResponse.findMany({
      where: { inquiryId: id },
      orderBy: { createdAt: 'asc' }
    });
    
    return NextResponse.json({ responses });
    
  } catch (error) {
    console.error('Errore nel recupero risposte:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}