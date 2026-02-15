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
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    archived: 'bg-zinc-800 text-zinc-500 border-zinc-700',
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Card
        onClick={onClick}
        className={cn(
          "p-4 cursor-pointer transition-all duration-200 bg-zinc-800/50 hover:bg-zinc-800",
          selected
            ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] bg-zinc-800"
            : "border-zinc-800 hover:border-zinc-700"
        )}
      >
        {/* Header: Name */}
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-sm font-semibold text-zinc-100 flex-1 line-clamp-1">
            {venture.name}
          </h3>
        </div>

        {/* Status Badge + Active Task Count */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", statusColors[venture.status as keyof typeof statusColors])}>
            {venture.status.toUpperCase()}
          </Badge>
          {activeTasks > 0 && (
            <span className="text-[10px] text-zinc-500 font-medium">
              {activeTasks} ACTIVE
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {totalTasks > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1.5 font-bold uppercase tracking-wider">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5 bg-zinc-900" />
          </div>
        )}

        {/* Capital Spent */}
        <div className="flex justify-between items-center pt-1 border-t border-zinc-800/50 mt-1">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Investment</span>
          <span className="text-xs text-blue-400 font-mono">{formatCurrency(venture.capitalSpent || venture.capitalAllocated || 0)}</span>
        </div>
      </Card>
    </motion.div>
  );
}
