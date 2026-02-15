import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/activities - Fetch recent activities
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const activities = await prisma.activity.findMany({
      include: {
        venture: true,
        task: true,
        agent: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

// POST /api/activities - Create new activity
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, title, description, level, metadata, ventureId, taskId, agentId } = body;

    const activity = await prisma.activity.create({
      data: {
        type,
        title,
        description,
        level: level || 'info',
        metadata: metadata ? JSON.stringify(metadata) : null,
        ventureId,
        taskId,
        agentId,
      },
      include: {
        venture: true,
        task: true,
        agent: true,
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Failed to create activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
