import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/tasks/complete - Mark task as completed
export async function POST(request: Request) {
  try {
    const { taskId, agentId, output, actualCost, error: taskError } = await request.json();

    if (!taskId || !agentId) {
      return NextResponse.json(
        { error: 'Task ID and Agent ID are required' },
        { status: 400 }
      );
    }

    // Use a transaction to complete the task
    const result = await prisma.$transaction(async (tx) => {
      // Verify the task is assigned to this agent
      const task = await tx.task.findUnique({
        where: { id: taskId },
        include: { venture: true },
      });

      if (!task) {
        throw new Error('Task not found');
      }

      if (task.assignedTo !== agentId) {
        throw new Error('Task is not assigned to this agent');
      }

      // Update the task
      const completedTask = await tx.task.update({
        where: { id: taskId },
        data: {
          status: taskError ? 'queue' : 'completed', // If error, return to queue
          output,
          error: taskError,
          actualCost,
          completedAt: taskError ? null : new Date(),
          assignedTo: taskError ? null : task.assignedTo, // Unassign if error
        },
        include: {
          venture: true,
        },
      });

      // Update venture capital spent
      if (actualCost && !taskError) {
        await tx.venture.update({
          where: { id: task.ventureId },
          data: {
            capitalSpent: {
              increment: actualCost,
            },
          },
        });
      }

      // Create activity
      await tx.activity.create({
        data: {
          type: taskError ? 'error' : 'task_completed',
          title: taskError ? 'Task failed' : 'Task completed',
          description: taskError
            ? `Task "${task.title}" failed: ${taskError}`
            : `Task "${task.title}" completed successfully`,
          level: taskError ? 'error' : 'success',
          taskId: task.id,
          ventureId: task.ventureId,
          agentId: agentId,
          metadata: actualCost ? JSON.stringify({ cost: actualCost }) : null,
        },
      });

      // Update agent status back to online
      await tx.agent.update({
        where: { id: agentId },
        data: {
          status: 'online',
          currentTask: null,
          lastActiveAt: new Date(),
        },
      });

      return completedTask;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to complete task:', error);
    const message = error instanceof Error ? error.message : 'Failed to complete task';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
