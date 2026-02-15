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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 100 : 1,
      }}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div className="p-5 bg-card/40 backdrop-blur-md border border-white/5 hover:border-primary/40 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-primary/10 relative overflow-hidden">
        {/* Glow Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Priority Indicator Dot */}
        <div className="absolute top-5 right-5 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ color: priorityColor, backgroundColor: priorityColor }} />
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: priorityColor }}>{task.priority}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-white mb-3 line-clamp-2 uppercase tracking-tight group-hover:text-primary transition-colors">
          {task.title}
        </h3>

        {/* Venture + Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {venture && (
            <div className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
              {venture.name}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
          <div className="space-y-1">
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Resource</p>
            <p className="text-[10px] font-bold text-zinc-400">{task.estimatedCost ? formatCurrency(task.estimatedCost) : '---'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Compute</p>
            <p className="text-[10px] font-bold text-zinc-400">{task.estimatedTokens ? `${(task.estimatedTokens / 1000).toFixed(0)}k` : '---'}</p>
          </div>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (() => {
          const tagsArray = typeof task.tags === 'string'
            ? JSON.parse(task.tags)
            : task.tags;

          return (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tagsArray.slice(0, 3).map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-white/5 text-zinc-500 rounded-full border border-white/5 group-hover:border-white/10 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          );
        })()}
      </div>
    </motion.div>
  );
}
