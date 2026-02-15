import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus, Venture } from '@/types';
import { TASK_STATUS_LABELS } from '@/lib/constants';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  ventures: Venture[];
  onTaskClick: (task: Task) => void;
}

export function KanbanColumn({ title, status, tasks, ventures, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  // Filter tasks by status
  const columnTasks = tasks.filter(task => task.status === status);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-h-[300px] md:min-h-[400px] bg-zinc-900 rounded-lg border ${
        isOver ? 'border-blue-500 border-dashed' : 'border-zinc-800'
      } transition-colors`}
    >
      {/* Column Header */}
      <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-3 md:px-4 py-2.5 md:py-3 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xs md:text-sm font-semibold text-white uppercase tracking-wide">
            {title}
          </h2>
          <span className="text-xs font-medium text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
            {columnTasks.length}
          </span>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 p-3 md:p-4 space-y-2 md:space-y-3 overflow-y-auto custom-scrollbar">
        {columnTasks.length > 0 ? (
          columnTasks.map((task) => {
            const venture = ventures.find(v => v.id === task.ventureId);
            return (
              <TaskCard
                key={task.id}
                task={task}
                venture={venture}
                onClick={() => onTaskClick(task)}
              />
            );
          })
        ) : (
          <div className="flex items-center justify-center h-32 text-sm text-zinc-500">
            No tasks in {title.toLowerCase()}
          </div>
        )}
      </div>
    </div>
  );
}
