import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../../../../lib/auth';

const prisma = new PrismaClient();

// GET /api/bug-bounty/stats - Get bug bounty statistics
export async function GET(request: NextRequest) {
  try {
    const stats = await prisma.bugBountyStats.findFirst({
      include: {
        reports: {
          orderBy: { discoveredAt: 'desc' },
          take: 5, // Latest 5 reports for quick overview
          select: {
            id: true,
            title: true,
            severity: true,
            status: true,
            reward: true,
            discoveredAt: true,
            program: true,
            platform: true
          }
        },
        platforms: {
          where: { active: true },
          orderBy: { totalEarnings: 'desc' }
        },
        achievements: {
          where: { publicVisible: true },
          orderBy: { earnedAt: 'desc' },
          take: 10
        }
      }
    });

    if (!stats) {
      // Create default stats if none exist
      const defaultStats = await prisma.bugBountyStats.create({
        data: {},
        include: {
          reports: true,
          platforms: true,
          achievements: true
        }
      });
      return NextResponse.json(defaultStats);
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Bug bounty stats fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bug bounty statistics' },
      { status: 500 }
    );
  }
}

// PUT /api/bug-bounty/stats - Update bug bounty statistics (Admin only)
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const {
      totalBugs,
      criticalBugs,
      highBugs,
      mediumBugs,
      lowBugs,
      informationalBugs,
      totalReward,
      totalBounty,
      cveAssigned,
      hallOfFame,
      publicDisclosures,
      avgResolutionDays,
      fastestResolution
    } = body;

    // Calculate avgRewardPerBug
    const avgRewardPerBug = totalBugs > 0 ? totalReward / totalBugs : 0;

    let stats = await prisma.bugBountyStats.findFirst();
    
    if (!stats) {
      stats = await prisma.bugBountyStats.create({
        data: {
          totalBugs: totalBugs || 0,
          criticalBugs: criticalBugs || 0,
          highBugs: highBugs || 0,
          mediumBugs: mediumBugs || 0,
          lowBugs: lowBugs || 0,
          informationalBugs: informationalBugs || 0,
          totalReward: totalReward || 0,
          totalBounty: totalBounty || 0,
          avgRewardPerBug,
          cveAssigned: cveAssigned || 0,
          hallOfFame: hallOfFame || 0,
          publicDisclosures: publicDisclosures || 0,
          avgResolutionDays: avgResolutionDays || 0,
          fastestResolution: fastestResolution || 0
        }
      });
    } else {
      stats = await prisma.bugBountyStats.update({
        where: { id: stats.id },
        data: {
          totalBugs: totalBugs || stats.totalBugs,
          criticalBugs: criticalBugs || stats.criticalBugs,
          highBugs: highBugs || stats.highBugs,
          mediumBugs: mediumBugs || stats.mediumBugs,
          lowBugs: lowBugs || stats.lowBugs,
          informationalBugs: informationalBugs || stats.informationalBugs,
          totalReward: totalReward || stats.totalReward,
          totalBounty: totalBounty || stats.totalBounty,
          avgRewardPerBug,
          cveAssigned: cveAssigned || stats.cveAssigned,
          hallOfFame: hallOfFame || stats.hallOfFame,
          publicDisclosures: publicDisclosures || stats.publicDisclosures,
          avgResolutionDays: avgResolutionDays || stats.avgResolutionDays,
          fastestResolution: fastestResolution || stats.fastestResolution
        }
      });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Bug bounty stats update error:', error);
    
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to update bug bounty statistics' },
      { status: 500 }
    );
  }
}