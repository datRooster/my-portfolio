import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../../../../lib/auth';

const prisma = new PrismaClient();

// GET /api/bug-bounty/reports - Get bug reports with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');
    const platform = searchParams.get('platform');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'discoveredAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: Record<string, any> = {};
    
    if (severity && severity !== 'all') {
      where.severity = severity;
    }
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (platform && platform !== 'all') {
      where.platform = { contains: platform, mode: 'insensitive' };
    }
    
    if (category && category !== 'all') {
      where.category = category;
    }

    const reports = await prisma.bugReport.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      take: limit,
      skip: offset,
      select: {
        id: true,
        title: true,
        description: true,
        severity: true,
        category: true,
        program: true,
        platform: true,
        status: true,
        reward: true,
        currency: true,
        discoveredAt: true,
        reportedAt: true,
        resolvedAt: true,
        cveId: true,
        methodology: true,
        tools: true,
        screenshots: true,
        publicUrl: true,
        blogPostUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const totalCount = await prisma.bugReport.count({ where });

    return NextResponse.json({
      reports,
      totalCount,
      hasMore: offset + limit < totalCount
    });
  } catch (error) {
    console.error('Bug reports fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bug reports' },
      { status: 500 }
    );
  }
}

// POST /api/bug-bounty/reports - Create new bug report (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    
    const report = await prisma.bugReport.create({
      data: {
        title: body.title,
        description: body.description,
        privateNotes: body.privateNotes,
        severity: body.severity,
        category: body.category,
        cweId: body.cweId,
        cveId: body.cveId,
        program: body.program,
        platform: body.platform,
        programUrl: body.programUrl,
        methodology: body.methodology || [],
        tools: body.tools || [],
        payload: body.payload,
        impact: body.impact,
        affectedAssets: body.affectedAssets || [],
        usersAffected: body.usersAffected,
        discoveredAt: new Date(body.discoveredAt),
        reportedAt: new Date(body.reportedAt),
        firstResponseAt: body.firstResponseAt ? new Date(body.firstResponseAt) : null,
        resolvedAt: body.resolvedAt ? new Date(body.resolvedAt) : null,
        disclosedAt: body.disclosedAt ? new Date(body.disclosedAt) : null,
        status: body.status || 'SUBMITTED',
        resolution: body.resolution,
        reproducible: body.reproducible ?? true,
        duplicate: body.duplicate ?? false,
        reward: body.reward,
        currency: body.currency || 'USD',
        bonusReward: body.bonusReward,
        screenshots: body.screenshots || [],
        proofOfConcept: body.proofOfConcept || [],
        reportUrl: body.reportUrl,
        publicUrl: body.publicUrl,
        blogPostUrl: body.blogPostUrl,
        collaborators: body.collaborators || [],
        credits: body.credits
      }
    });

    // Update stats if needed
    await updateBugBountyStats();

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Bug report creation error:', error);
    
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to create bug report' },
      { status: 500 }
    );
  }
}

// Helper function to update bug bounty stats
async function updateBugBountyStats() {
  try {
    const aggregatedStats = await prisma.bugReport.aggregate({
      _count: { id: true },
      _sum: { 
        reward: true,
        bonusReward: true 
      },
      _avg: { reward: true }
    });

    const severityCounts = await prisma.bugReport.groupBy({
      by: ['severity'],
      _count: { severity: true }
    });

    const cveCount = await prisma.bugReport.count({
      where: { cveId: { not: null } }
    });

    const resolvedReports = await prisma.bugReport.findMany({
      where: { 
        reportedAt: { not: undefined },
        resolvedAt: { not: undefined }
      },
      select: {
        reportedAt: true,
        resolvedAt: true
      }
    });

    // Calculate average resolution time
    let avgResolutionDays = 0;
    let fastestResolution = 0;
    
    if (resolvedReports.length > 0) {
      const resolutionTimes = resolvedReports.map((report: any) => {
        const diffTime = Math.abs(report.resolvedAt!.getTime() - report.reportedAt.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
      });
      
      avgResolutionDays = resolutionTimes.reduce((sum: number, days: number) => sum + days, 0) / resolutionTimes.length;
      fastestResolution = Math.min(...resolutionTimes) * 24; // Convert to hours
    }

    // Prepare severity counts
    const severityMap = severityCounts.reduce((acc: Record<string, number>, item: any) => {
      acc[item.severity.toLowerCase() + 'Bugs'] = item._count.severity;
      return acc;
    }, {} as Record<string, number>);

    const totalReward = (aggregatedStats._sum.reward || 0) + (aggregatedStats._sum.bonusReward || 0);

    let stats = await prisma.bugBountyStats.findFirst();
    
    const statsData = {
      totalBugs: aggregatedStats._count.id,
      criticalBugs: severityMap.criticalBugs || 0,
      highBugs: severityMap.highBugs || 0,
      mediumBugs: severityMap.mediumBugs || 0,
      lowBugs: severityMap.lowBugs || 0,
      informationalBugs: severityMap.informationalBugs || 0,
      totalReward: totalReward,
      totalBounty: totalReward,
      avgRewardPerBug: aggregatedStats._avg.reward || 0,
      cveAssigned: cveCount,
      avgResolutionDays: Math.round(avgResolutionDays * 100) / 100,
      fastestResolution: fastestResolution
    };

    if (!stats) {
      await prisma.bugBountyStats.create({ data: statsData });
    } else {
      await prisma.bugBountyStats.update({
        where: { id: stats.id },
        data: statsData
      });
    }
  } catch (error) {
    console.error('Failed to update bug bounty stats:', error);
  }
}