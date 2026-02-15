import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tasks - Fetch all tasks
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        venture: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST /api/tasks - Create new task
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, status, priority, estimatedCost, ventureId, tags } = body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'queue',
        priority: priority || 'medium',
        estimatedCost,
        ventureId,
        tags: tags ? JSON.stringify(tags) : null,
      },
      include: {
        venture: true,
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        type: 'task_created',
        title: 'Task created',
        description: `Task "${title}" was added to the queue`,
        level: 'info',
        taskId: task.id,
        ventureId: task.ventureId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// PATCH /api/tasks - Update task
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Handle tags if present
    if (updates.tags) {
      updates.tags = JSON.stringify(updates.tags);
    }

    const task = await prisma.task.update({
      where: { id },
      data: updates,
      include: {
        venture: true,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Failed to update task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE /api/tasks - Delete task
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
