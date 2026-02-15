import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/tasks/claim - Atomically claim a task for an agent
export async function POST(request: Request) {
  try {
    const { agentId, agentName } = await request.json();

    if (!agentId) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

    // Use a transaction to atomically claim a task
    const result = await prisma.$transaction(async (tx) => {
      // Find the first available task (queue status, not assigned)
      const availableTask = await tx.task.findFirst({
        where: {
          status: 'queue',
          assignedTo: null,
        },
        orderBy: [
          { priority: 'desc' }, // High priority first
          { createdAt: 'asc' }, // Oldest first
        ],
        include: {
          venture: true,
        },
      });

      if (!availableTask) {
        return null;
      }

      // Claim the task
      const claimedTask = await tx.task.update({
        where: { id: availableTask.id },
        data: {
          status: 'active',
          assignedTo: agentId,
        },
        include: {
          venture: true,
        },
      });

      // Create activity
      await tx.activity.create({
        data: {
          type: 'task_started',
          title: 'Task started',
          description: `Agent ${agentName || agentId} started working on "${claimedTask.title}"`,
          level: 'info',
          taskId: claimedTask.id,
          ventureId: claimedTask.ventureId,
          agentId: agentId,
        },
      });

      // Update agent status
      await tx.agent.update({
        where: { id: agentId },
        data: {
          status: 'busy',
          currentTask: claimedTask.title,
          lastActiveAt: new Date(),
        },
      });

      return claimedTask;
    });

    if (!result) {
      return NextResponse.json({ message: 'No available tasks' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to claim task:', error);
    return NextResponse.json({ error: 'Failed to claim task' }, { status: 500 });
  }
}
