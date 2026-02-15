import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/agents - Fetch all agents
export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: {
        lastActiveAt: 'desc',
      },
    });
    return NextResponse.json(agents);
  } catch (error) {
    console.error('Failed to fetch agents:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

// POST /api/agents - Create or update agent
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, status, model, currentTask, tokensUsed, maxTokens } = body;

    // Upsert: create if doesn't exist, update if it does
    const agent = await prisma.agent.upsert({
      where: { id: id || 'new' },
      create: {
        id,
        name,
        status: status || 'offline',
        model,
        currentTask,
        tokensUsed: tokensUsed || 0,
        maxTokens: maxTokens || 200000,
        lastActiveAt: new Date(),
      },
      update: {
        status,
        currentTask,
        tokensUsed,
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json(agent);
  } catch (error) {
    console.error('Failed to upsert agent:', error);
    return NextResponse.json({ error: 'Failed to upsert agent' }, { status: 500 });
  }
}

// PATCH /api/agents - Update agent
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

    const agent = await prisma.agent.update({
      where: { id },
      data: {
        ...updates,
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json(agent);
  } catch (error) {
    console.error('Failed to update agent:', error);
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
  }
}

// DELETE /api/agents - Delete agent
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

    await prisma.agent.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete agent:', error);
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 });
  }
}
