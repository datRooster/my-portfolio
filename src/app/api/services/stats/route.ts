import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';

export const runtime = 'nodejs';

// GET /api/services/stats - Statistiche dei servizi (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30'; // giorni
    
    const daysAgo = parseInt(timeframe);
    const dateFilter = new Date();
    dateFilter.setDate(dateFilter.getDate() - daysAgo);
    
    // Statistiche generali
    const [
      totalServices,
      activeServices,
      totalInquiries,
      newInquiries,
      respondedInquiries,
      pendingInquiries,
      totalTestimonials,
      approvedTestimonials,
      recentInquiries,
      topServices,
      inquiriesByStatus,
      averageRating
    ] = await Promise.all([
      // Servizi totali
      prisma.service.count(),
      
      // Servizi attivi
      prisma.service.count({
        where: { status: 'ACTIVE' }
      }),
      
      // Richieste totali
      prisma.serviceInquiry.count(),
      
      // Nuove richieste nel periodo
      prisma.serviceInquiry.count({
        where: {
          createdAt: { gte: dateFilter }
        }
      }),
      
      // Richieste risposts
      prisma.serviceInquiry.count({
        where: { status: 'RESPONDED' }
      }),
      
      // Richieste in attesa
      prisma.serviceInquiry.count({
        where: { status: { in: ['NEW', 'REVIEWED'] } }
      }),
      
      // Testimonial totali
      prisma.testimonial.count(),
      
      // Testimonial approvati
      prisma.testimonial.count({
        where: { approved: true }
      }),
      
      // Richieste recenti (ultime 10)
      prisma.serviceInquiry.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          service: {
            select: {
              name: true,
              slug: true
            }
          }
        }
      }),
      
      // Servizi più richiesti
      prisma.service.findMany({
        include: {
          _count: {
            select: { inquiries: true }
          }
        },
        orderBy: {
          inquiries: {
            _count: 'desc'
          }
        },
        take: 5
      }),
      
      // Richieste per status
      prisma.serviceInquiry.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      }),
      
      // Rimosse statistiche per sorgente - campo non presente
      
      // Rating medio testimonial
      prisma.testimonial.aggregate({
        where: { approved: true },
        _avg: {
          rating: true
        }
      })
    ]);
    
    // Trend richieste (ultimi 7 giorni)
    const inquiriesTrend = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const count = await prisma.serviceInquiry.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            }
          }
        });
        
        return {
          date: date.toISOString().split('T')[0],
          count
        };
      })
    );
    
    // Calcola tassi di conversione
    const responseRate = totalInquiries > 0 
      ? ((respondedInquiries / totalInquiries) * 100).toFixed(1)
      : '0';
    
    const testimonialRate = respondedInquiries > 0
      ? ((approvedTestimonials / respondedInquiries) * 100).toFixed(1)
      : '0';
    
    return NextResponse.json({
      overview: {
        totalServices,
        activeServices,
        totalInquiries,
        newInquiries,
        pendingInquiries,
        totalTestimonials,
        approvedTestimonials,
        responseRate: parseFloat(responseRate),
        testimonialRate: parseFloat(testimonialRate),
        averageRating: averageRating._avg.rating || 0
      },
      trends: {
        inquiriesTrend: inquiriesTrend.reverse(), // Dal più vecchio al più recente
        timeframe: daysAgo
      },
      breakdowns: {
        inquiriesByStatus: inquiriesByStatus.map(item => ({
          status: item.status,
          count: item._count.status
        }))
      },
      recentActivity: {
        recentInquiries: recentInquiries.map(inquiry => ({
          id: inquiry.id,
          name: inquiry.name,
          email: inquiry.email,
          service: inquiry.service?.name,
          status: inquiry.status,
          priority: inquiry.priority,
          createdAt: inquiry.createdAt
        }))
      },
      topPerformers: {
        topServices: topServices.map(service => ({
          id: service.id,
          name: service.name,
          slug: service.slug,
          inquiriesCount: service._count.inquiries,
          status: service.status
        }))
      }
    });
    
  } catch (error) {
    console.error('Errore nel recupero statistiche:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}