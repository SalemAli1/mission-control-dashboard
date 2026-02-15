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
    <div className="flex flex-col h-full glass-dark rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-white/5">
        <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Telemetry Feed</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
            {displayedActivities.length} Pulse Events Detected
          </p>
        </div>
      </div>

      {/* Activity List */}
      <div
        ref={feedRef}
        className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar max-h-[400px] md:max-h-[700px] bg-black/20"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {displayedActivities.length > 0 ? (
            displayedActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-[10px] text-zinc-600 font-black uppercase tracking-widest gap-3 border-2 border-dashed border-white/5 rounded-2xl">
              <div className="w-8 h-8 rounded-full border border-zinc-800 animate-pulse flex items-center justify-center">
                  <div className="w-1 h-1 bg-zinc-700 rounded-full" />
              </div>
              Awaiting Signal...
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
