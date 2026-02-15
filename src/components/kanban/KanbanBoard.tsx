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
    <div className="space-y-3 md:space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-base md:text-lg font-semibold text-zinc-100">
          {selectedVenture
            ? `${ventures.find(v => v.id === selectedVenture)?.name} Board`
            : 'All Tasks'}
        </h2>
        {onCreateClick && (
          <Button
            size="sm"
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-500 text-white gap-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        )}
      </div>

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <KanbanColumn
            title="Queue"
            status="queue"
            tasks={filteredTasks}
            ventures={ventures}
            onTaskClick={onTaskClick}
          />
          <KanbanColumn
            title="Active"
            status="active"
            tasks={filteredTasks}
            ventures={ventures}
            onTaskClick={onTaskClick}
          />
          <KanbanColumn
            title="Completed"
            status="completed"
            tasks={filteredTasks}
            ventures={ventures}
            onTaskClick={onTaskClick}
          />
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <div className="opacity-80 shadow-2xl rotate-2">
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
