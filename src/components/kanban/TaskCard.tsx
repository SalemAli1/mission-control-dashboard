import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Task, Venture } from '@/types';
import { PRIORITY_COLORS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  venture?: Venture;
  onClick: () => void;
}

export function TaskCard({ task, venture, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const priorityColor = PRIORITY_COLORS[task.priority];

  return (
    <motion.div
      ref={setNodeRef}
      layoutId={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 1,
      }}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="p-4 bg-zinc-800 border-zinc-700 hover:border-zinc-500 hover:shadow-lg transition-all duration-200">
        {/* Title */}
        <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">
          {task.title}
        </h3>

        {/* Venture + Priority */}
        <div className="flex items-center gap-2 mb-3">
          {venture && (
            <Badge variant="outline" className="text-xs border-zinc-600 bg-zinc-900/50">
              {venture.name}
            </Badge>
          )}
          <Badge 
            variant="outline" 
            className="text-xs font-bold"
            style={{ 
              borderColor: `${priorityColor}50`,
              color: priorityColor,
              backgroundColor: `${priorityColor}10`
            }}
          >
            {task.priority.toUpperCase()}
          </Badge>
        </div>

        {/* Estimates */}
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          {task.estimatedCost && (
            <span className="flex items-center gap-1">{formatCurrency(task.estimatedCost)}</span>
          )}
          {task.estimatedTokens && (
            <span className="flex items-center gap-1">{(task.estimatedTokens / 1000).toFixed(0)}k tokens</span>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (() => {
          // Parse tags if they're stored as JSON string
          const tagsArray = typeof task.tags === 'string'
            ? JSON.parse(task.tags)
            : task.tags;

          return (
            <div className="mt-3 flex flex-wrap gap-1">
              {tagsArray.slice(0, 3).map((tag: string) => (
                <span
                  key={tag}
                  className="inline-block px-1.5 py-0.5 text-[10px] bg-zinc-900 text-zinc-400 rounded border border-zinc-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          );
        })()}
      </Card>
    </motion.div>
  );
}
