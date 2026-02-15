import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Venture } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface VentureCardProps {
  venture: Venture;
  selected: boolean;
  onClick: () => void;
  activeTasks: number;
  completedTasks: number;
  totalTasks: number;
}

export function VentureCard({
  venture,
  selected,
  onClick,
  activeTasks,
  completedTasks,
  totalTasks,
}: VentureCardProps) {
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const statusColors = {
    active: 'bg-success/10 text-success border-success/20',
    paused: 'bg-warning/10 text-warning border-warning/20',
    completed: 'bg-primary/10 text-primary border-primary/20',
    archived: 'bg-zinc-800 text-zinc-500 border-zinc-700',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div
        onClick={onClick}
        className={cn(
          "p-4 cursor-pointer transition-all duration-300 rounded-2xl border backdrop-blur-md",
          selected
            ? "bg-primary/5 border-primary shadow-[0_0_20px_rgba(var(--color-primary),0.1)]"
            : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10"
        )}
      >
        {/* Header: Name */}
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-xs font-black text-white flex-1 line-clamp-1 uppercase tracking-tight">
            {venture.name}
          </h3>
          <Badge variant="outline" className={cn("text-[8px] font-black px-1.5 py-0 border-[0.5px]", statusColors[venture.status as keyof typeof statusColors])}>
            {venture.status}
          </Badge>
        </div>

        {/* Progress Bar */}
        {totalTasks > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-[9px] text-zinc-500 mb-2 font-black uppercase tracking-widest">
              <span>Sync</span>
              <span className="text-zinc-400">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${progressPercentage}%` }} 
                />
            </div>
          </div>
        )}

        {/* Investment */}
        <div className="flex justify-between items-center pt-3 border-t border-white/5">
          <span className="text-[8px] text-zinc-600 uppercase font-black tracking-[0.2em]">Investment</span>
          <span className="text-[10px] text-primary font-black tracking-tighter">{formatCurrency(venture.capitalSpent || venture.capitalAllocated || 0)}</span>
        </div>
      </div>
    </motion.div>
  );
}
