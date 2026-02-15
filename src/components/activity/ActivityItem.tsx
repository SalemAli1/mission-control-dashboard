import { motion } from 'framer-motion';
import type { Activity } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  // Color-coded left border based on activity level
  const levelColors = {
    info: 'border-blue-500 bg-blue-500/5',
    success: 'border-green-500 bg-green-500/5',
    warning: 'border-yellow-500 bg-yellow-500/5',
    error: 'border-red-500 bg-red-500/5',
  };

  const statusStyle = levelColors[activity.level] || 'border-zinc-600 bg-zinc-600/5';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
      className={cn(
        "p-3 border-l-4 rounded-r-md transition-all duration-200",
        statusStyle
      )}
    >
      {/* Title */}
      <div className="flex items-start gap-2 mb-1">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-zinc-100 line-clamp-1 tracking-tight">
            {activity.title}
          </h4>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 whitespace-nowrap mt-0.5">
          {formatRelativeTime(activity.timestamp)}
        </span>
      </div>

      {/* Description */}
      {activity.description && (
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {activity.description}
        </p>
      )}
    </motion.div>
  );
}
