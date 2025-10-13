import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../../../../lib/auth';

const prisma = new PrismaClient();

// GET /api/bug-bounty/achievements - Get all achievements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const verified = searchParams.get('verified');

    const where: Record<string, any> = {};
    
    if (type && type !== 'all') {
      where.type = type;
    }
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (verified === 'true') {
      where.verified = true;
    } else if (verified === 'false') {
      where.verified = false;
    }

    const achievements = await prisma.achievement.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { earnedAt: 'desc' }
      ],
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        icon: true,
        badgeUrl: true,
        color: true,
        issuedBy: true,
        certificateUrl: true,
        verificationUrl: true,
        criteria: true,
        difficulty: true,
        rarity: true,
        earnedAt: true,
        expiresAt: true,
        points: true,
        monetaryValue: true,
        featured: true,
        publicVisible: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Achievements fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}

// POST /api/bug-bounty/achievements - Create new achievement (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    
    const achievement = await prisma.achievement.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category || 'OTHER',
        icon: body.icon,
        badgeUrl: body.badgeUrl,
        color: body.color,
        issuedBy: body.issuedBy,
        certificateUrl: body.certificateUrl,
        verificationUrl: body.verificationUrl,
        criteria: body.criteria,
        difficulty: body.difficulty || 'MEDIUM',
        rarity: body.rarity,
        earnedAt: new Date(body.earnedAt),
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        points: body.points,
        monetaryValue: body.monetaryValue,
        featured: body.featured ?? false,
        publicVisible: body.publicVisible ?? true
      }
    });

    return NextResponse.json(achievement, { status: 201 });
  } catch (error) {
    console.error('Achievement creation error:', error);
    
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to create achievement' },
      { status: 500 }
    );
  }
}

// PUT /api/bug-bounty/achievements - Update achievement (Admin only)
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Achievement ID is required' },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects if present
    if (updateData.earnedAt) {
      updateData.earnedAt = new Date(updateData.earnedAt);
    }

    const achievement = await prisma.achievement.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(achievement);
  } catch (error) {
    console.error('Achievement update error:', error);
    
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to update achievement' },
      { status: 500 }
    );
  }
}

// DELETE /api/bug-bounty/achievements - Delete achievement (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Achievement ID is required' },
        { status: 400 }
      );
    }

    await prisma.achievement.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Achievement deletion error:', error);
    
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to delete achievement' },
      { status: 500 }
    );
  }
}