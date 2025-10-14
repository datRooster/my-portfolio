import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { InquiryStatus, InquiryPriority } from '@prisma/client';

export const runtime = 'nodejs';

// POST /api/services/inquiries - Crea una nuova richiesta
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validazione campi obbligatori
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Nome, email e messaggio sono obbligatori' },
        { status: 400 }
      );
    }
    
    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Email non valida' },
        { status: 400 }
      );
    }
    
    // Verifica che il servizio esista se specificato
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
    
    // Crea la richiesta
    const inquiry = await prisma.serviceInquiry.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        subject: data.subject || `Richiesta informazioni${data.serviceId ? ' per servizio' : ''}`,
        message: data.message,
        budget: data.budget,
        timeline: data.timeline,
        projectType: data.projectType,
        serviceId: data.serviceId,
        status: 'NEW',
        priority: data.priority || 'MEDIUM'
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });
    
    // Qui potresti aggiungere l'invio di email di notifica
    // await sendNotificationEmail(inquiry);
    
    return NextResponse.json(
      {
        message: 'Richiesta inviata con successo',
        inquiry: {
          id: inquiry.id,
          status: inquiry.status,
          createdAt: inquiry.createdAt
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Errore nella creazione richiesta:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// GET /api/services/inquiries - Lista richieste (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filtri
    const status = searchParams.get('status') as InquiryStatus | null;
    const priority = searchParams.get('priority') as InquiryPriority | null;
    const serviceId = searchParams.get('serviceId');
    // const source = searchParams.get('source') as InquirySource | null;
    
    // Paginazione
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Costruisci where clause
    const where: any = {};
    
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (serviceId) where.serviceId = serviceId;
    
    // Query con filtri
    const [inquiries, total] = await Promise.all([
      prisma.serviceInquiry.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
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
          responses: {
            orderBy: { createdAt: 'desc' },
            take: 1 // Ultima risposta
          }
        }
      }),
      prisma.serviceInquiry.count({ where })
    ]);
    
    // Metadata paginazione
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return NextResponse.json({
      inquiries,
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
    console.error('Errore nel recupero richieste:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}