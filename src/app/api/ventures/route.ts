import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/ventures - Fetch all ventures
export async function GET() {
  try {
    const ventures = await prisma.venture.findMany({
      include: {
        tasks: true,
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(ventures);
  } catch (error) {
    console.error('Failed to fetch ventures:', error);
    return NextResponse.json({ error: 'Failed to fetch ventures' }, { status: 500 });
  }
}

// POST /api/ventures - Create new venture
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, icon, status, priority, capitalBudget, description } = body;

    const venture = await prisma.venture.create({
      data: {
        name,
        icon: icon || '📁',
        status: status || 'active',
        priority: priority || 'medium',
        capitalBudget,
        description,
      },
    });

    return NextResponse.json(venture);
  } catch (error) {
    console.error('Failed to create venture:', error);
    return NextResponse.json({ error: 'Failed to create venture' }, { status: 500 });
  }
}

// PATCH /api/ventures - Update venture
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Venture ID is required' }, { status: 400 });
    }

    const venture = await prisma.venture.update({
      where: { id },
      data: updates,
      include: {
        tasks: true,
      },
    });

    return NextResponse.json(venture);
  } catch (error) {
    console.error('Failed to update venture:', error);
    return NextResponse.json({ error: 'Failed to update venture' }, { status: 500 });
  }
}

// DELETE /api/ventures - Delete venture
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Venture ID is required' }, { status: 400 });
    }

    await prisma.venture.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete venture:', error);
    return NextResponse.json({ error: 'Failed to delete venture' }, { status: 500 });
  }
}
