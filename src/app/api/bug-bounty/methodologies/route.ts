import { NextRequest, NextResponse } from 'next/server';
import { MethodologyCategory, Prisma, PrismaClient } from '@prisma/client';
import { writeStringArray } from '@/lib/database/mysql-json';
import { normalizeMethodologyCollections } from '@/lib/database/serializers';
import { requireAdmin } from '../../../../lib/auth';

const prisma = new PrismaClient();

// GET /api/bug-bounty/methodologies - Get all methodologies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const where: Prisma.MethodologyWhereInput = {};
    
    if (category && category !== 'all') {
      where.category = category as MethodologyCategory;
    }
    
    if (featured === 'true') {
      where.featured = true;
    }

    const methodologies = await prisma.methodology.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { name: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        steps: true,
        tools: true,
        prerequisites: true,
        exampleTargets: true,
        examplePayloads: true,
        commonMistakes: true,
        difficulty: true,
        estimatedTime: true,
        successRate: true,
        resources: true,
        references: true,
        timesUsed: true,
        bugsFound: true,
        lastUsed: true,
        featured: true,
        publicVisible: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(
      methodologies.map((methodology) => normalizeMethodologyCollections(methodology))
    );
  } catch (error) {
    console.error('Methodologies fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch methodologies' },
      { status: 500 }
    );
  }
}

// POST /api/bug-bounty/methodologies - Create new methodology (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    
    const methodology = await prisma.methodology.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        steps: writeStringArray(body.steps),
        tools: writeStringArray(body.tools),
        prerequisites: writeStringArray(body.prerequisites),
        exampleTargets: writeStringArray(body.exampleTargets),
        examplePayloads: writeStringArray(body.examplePayloads),
        commonMistakes: writeStringArray(body.commonMistakes),
        difficulty: body.difficulty || 'INTERMEDIATE',
        estimatedTime: body.estimatedTime,
        successRate: body.successRate,
        resources: writeStringArray(body.resources),
        references: writeStringArray(body.references),
        timesUsed: body.timesUsed || 0,
        bugsFound: body.bugsFound || 0,
        lastUsed: body.lastUsed ? new Date(body.lastUsed) : null,
        featured: body.featured ?? false,
        publicVisible: body.publicVisible ?? true
      }
    });

    return NextResponse.json(normalizeMethodologyCollections(methodology), { status: 201 });
  } catch (error) {
    console.error('Methodology creation error:', error);
    
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to create methodology' },
      { status: 500 }
    );
  }
}

// PUT /api/bug-bounty/methodologies - Update methodology (Admin only)
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Methodology ID is required' },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects if present
    if (updateData.lastUsed) {
      updateData.lastUsed = new Date(updateData.lastUsed);
    }

    if (updateData.steps !== undefined) {
      updateData.steps = writeStringArray(updateData.steps);
    }

    if (updateData.tools !== undefined) {
      updateData.tools = writeStringArray(updateData.tools);
    }

    if (updateData.prerequisites !== undefined) {
      updateData.prerequisites = writeStringArray(updateData.prerequisites);
    }

    if (updateData.exampleTargets !== undefined) {
      updateData.exampleTargets = writeStringArray(updateData.exampleTargets);
    }

    if (updateData.examplePayloads !== undefined) {
      updateData.examplePayloads = writeStringArray(updateData.examplePayloads);
    }

    if (updateData.commonMistakes !== undefined) {
      updateData.commonMistakes = writeStringArray(updateData.commonMistakes);
    }

    if (updateData.resources !== undefined) {
      updateData.resources = writeStringArray(updateData.resources);
    }

    if (updateData.references !== undefined) {
      updateData.references = writeStringArray(updateData.references);
    }

    const methodology = await prisma.methodology.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(normalizeMethodologyCollections(methodology));
  } catch (error) {
    console.error('Methodology update error:', error);
    
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to update methodology' },
      { status: 500 }
    );
  }
}

// DELETE /api/bug-bounty/methodologies - Delete methodology (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Methodology ID is required' },
        { status: 400 }
      );
    }

    await prisma.methodology.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Methodology deletion error:', error);
    
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to delete methodology' },
      { status: 500 }
    );
  }
}
