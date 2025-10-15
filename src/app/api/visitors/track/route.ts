import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, referrer, userAgent, timestamp } = body;
    
    // Genera fingerprint anonimo basato su IP + User Agent (senza salvare dati personali)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    // Hash semplice per anonimato (senza usare crypto)
    const rawFingerprint = `${ip}-${userAgent}`;
    const fingerprint = Buffer.from(rawFingerprint)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 16);

    // Estrai informazioni utili dall'user agent (senza salvarlo completamente)
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent || '');
    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent || '');
    
    // Skip bot traffic
    if (isBot) {
      return NextResponse.json({ success: true, message: 'Bot detected, skipped' });
    }

    // Cerca sessione esistente
    let session = await prisma.visitorSession.findFirst({
      where: { fingerprint },
      orderBy: { lastSeen: 'desc' }
    });

    const now = new Date();

    if (session) {
      // Aggiorna sessione esistente se l'ultima attività è < 30 minuti fa
      const lastSeenTime = new Date(session.lastSeen).getTime();
      const timeDiff = now.getTime() - lastSeenTime;
      
      if (timeDiff < 30 * 60 * 1000) { // 30 minuti
        // Aggiorna sessione esistente
        await prisma.visitorSession.update({
          where: { id: session.id },
          data: {
            lastSeen: now,
            pageViews: session.pageViews + 1,
            currentPage: page
          }
        });
      } else {
        // Crea nuova sessione
        await prisma.visitorSession.create({
          data: {
            fingerprint,
            firstSeen: now,
            lastSeen: now,
            pageViews: 1,
            currentPage: page,
            referrer: referrer || null,
            isMobile,
            country: null // Potremo aggiungere geolocalizzazione in futuro
          }
        });
      }
    } else {
      // Prima visita, crea nuova sessione
      await prisma.visitorSession.create({
        data: {
          fingerprint,
          firstSeen: now,
          lastSeen: now,
          pageViews: 1,
          currentPage: page,
          referrer: referrer || null,
          isMobile,
          country: null
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Visitor tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking visitor:', error);
    
    // Non bloccare l'esperienza utente se il tracking fallisce
    return NextResponse.json({ 
      success: false, 
      message: 'Tracking failed but continuing'
    }, { status: 200 });
  }
}