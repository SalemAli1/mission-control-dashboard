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
      className={`flex flex-col min-h-[300px] md:min-h-[500px] glass-dark rounded-2xl border transition-all duration-300 ${
        isOver ? 'border-primary/50 bg-primary/5 scale-[1.01] shadow-2xl' : 'border-white/5'
      }`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-md rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-primary animate-pulse' : status === 'completed' ? 'bg-success' : 'bg-zinc-600'}`} />
            <h2 className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.2em]">
              {title}
            </h2>
          </div>
          <span className="text-[10px] font-black text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            {columnTasks.length}
          </span>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar bg-black/10">
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
          <div className="flex flex-col items-center justify-center h-48 text-[10px] text-zinc-600 font-black uppercase tracking-widest gap-2">
             <div className="w-1 h-1 bg-zinc-800 rounded-full" />
             Sector Empty
          </div>
        )}
      </div>
    </div>
  );
}
