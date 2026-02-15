import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ActivityItem } from './ActivityItem';
import type { Activity } from '@/types';

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
  autoScroll?: boolean;
}

export function ActivityFeed({ 
  activities, 
  maxItems = 20, 
  autoScroll = true 
}: ActivityFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when new activity is added
  useEffect(() => {
    if (autoScroll && feedRef.current) {
      feedRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activities.length, autoScroll]);

  // Limit to maxItems
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pb-3 md:pb-4 border-b border-zinc-800">
        <h2 className="text-base md:text-lg font-bold text-zinc-100 tracking-tight">Recent Activity</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
            Live Feed • {displayedActivities.length} EVENTS
          </p>
        </div>
      </div>

      {/* Activity List */}
      <div
        ref={feedRef}
        className="flex-1 mt-3 md:mt-4 space-y-2 md:space-y-3 overflow-y-auto custom-scrollbar max-h-[400px] md:max-h-[600px] pb-6"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {displayedActivities.length > 0 ? (
            displayedActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-zinc-600 border border-dashed border-zinc-800 rounded-lg">
              Waiting for signal...
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
