import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../../../../lib/auth';

const prisma = new PrismaClient();

// GET /api/bug-bounty/platforms - Get all platforms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const active = searchParams.get('active');

    const where: Record<string, any> = {};
    
    if (active === 'true') {
      where.active = true;
    } else if (active === 'false') {
      where.active = false;
    }

    const platforms = await prisma.platform.findMany({
      where,
      orderBy: [
        { active: 'desc' },
        { name: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        username: true,
        profileUrl: true,
        reputation: true,
        rank: true,
        points: true,
        level: true,
        bugsSubmitted: true,
        bugsAccepted: true,
        bugsDuplicate: true,
        bugsInformational: true,
        totalEarnings: true,
        averageReward: true,
        currency: true,
        hallOfFame: true,
        certificates: true,
        badges: true,
        joinedAt: true,
        lastActive: true,
        activeMonths: true,
        active: true,
        featured: true,
        publicProfile: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(platforms);
  } catch (error) {
    console.error('Platforms fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platforms' },
      { status: 500 }
    );
  }
}

// POST /api/bug-bounty/platforms - Create new platform (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    
    const platform = await prisma.platform.create({
      data: {
        name: body.name,
        username: body.username,
        profileUrl: body.profileUrl,
        reputation: body.reputation || 0,
        rank: body.rank,
        points: body.points || 0,
        level: body.level,
        bugsSubmitted: body.bugsSubmitted || 0,
        bugsAccepted: body.bugsAccepted || 0,
        bugsDuplicate: body.bugsDuplicate || 0,
        bugsInformational: body.bugsInformational || 0,
        totalEarnings: body.totalEarnings || 0.0,
        averageReward: body.averageReward || 0.0,
        currency: body.currency || 'USD',
        hallOfFame: body.hallOfFame || 0,
        certificates: body.certificates || [],
        badges: body.badges || [],
        joinedAt: body.joinedAt ? new Date(body.joinedAt) : null,
        lastActive: body.lastActive ? new Date(body.lastActive) : null,
        activeMonths: body.activeMonths || 0,
        active: body.active ?? true,
        featured: body.featured ?? false,
        publicProfile: body.publicProfile ?? true
      }
    });

    return NextResponse.json(platform, { status: 201 });
  } catch (error) {
    console.error('Platform creation error:', error);
    
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to create platform' },
      { status: 500 }
    );
  }
}

// PUT /api/bug-bounty/platforms - Update platform (Admin only)
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Platform ID is required' },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects if present
    if (updateData.joinedAt) {
      updateData.joinedAt = new Date(updateData.joinedAt);
    }

    const platform = await prisma.platform.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(platform);
  } catch (error) {
    console.error('Platform update error:', error);
    
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to update platform' },
      { status: 500 }
    );
  }
}

// DELETE /api/bug-bounty/platforms - Delete platform (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Platform ID is required' },
        { status: 400 }
      );
    }

    await prisma.platform.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Platform deletion error:', error);
    
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to delete platform' },
      { status: 500 }
    );
  }
}