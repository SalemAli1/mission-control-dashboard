import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus, Venture } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  ventures: Venture[];
  selectedVenture: string | null;
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
  onCreateClick?: () => void;
}

export function KanbanBoard({
  tasks,
  ventures,
  selectedVenture,
  onTaskMove,
  onTaskClick,
  onCreateClick,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Filter tasks by selected venture
  const filteredTasks = selectedVenture
    ? tasks.filter(task => task.ventureId === selectedVenture)
    : tasks;

  const handleDragStart = (event: { active: { id: string | number } }) => {
    const task = filteredTasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Move task to new column
      onTaskMove(active.id as string, over.id as TaskStatus);
    }
    
    setActiveTask(null);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_12px_var(--color-primary)]" />
            <h2 className="text-sm md:text-base font-black text-white uppercase tracking-[0.25em]">
              {selectedVenture
                ? `${ventures.find(v => v.id === selectedVenture)?.name} Terminal`
                : 'Central Command'}
            </h2>
        </div>
        {onCreateClick && (
          <Button
            size="sm"
            onClick={onCreateClick}
            className="bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 rounded-xl px-5 py-5 gap-2 w-full sm:w-auto font-black uppercase text-[10px] tracking-widest transition-all shadow-lg hover:shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Initialize Task
          </Button>
        )}
      </div>

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <KanbanColumn
            title="Awaiting Signal"
            status="queue"
            tasks={filteredTasks}
            ventures={ventures}
            onTaskClick={onTaskClick}
          />
          <KanbanColumn
            title="Processing"
            status="active"
            tasks={filteredTasks}
            ventures={ventures}
            onTaskClick={onTaskClick}
          />
          <KanbanColumn
            title="Link Established"
            status="completed"
            tasks={filteredTasks}
            ventures={ventures}
            onTaskClick={onTaskClick}
          />
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <div className="opacity-60 shadow-2xl rotate-1 scale-105 transition-transform duration-200">
              <TaskCard
                task={activeTask}
                venture={ventures.find(v => v.id === activeTask.ventureId)}
                onClick={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
