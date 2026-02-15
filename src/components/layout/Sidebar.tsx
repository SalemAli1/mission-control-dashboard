import { motion } from 'framer-motion';
import { VentureList } from '@/components/ventures/VentureList';
import { AgentList } from '@/components/agents/AgentList';
import type { Venture, Agent, Task } from '@/types';

interface SidebarProps {
  ventures: Venture[];
  agents: Agent[];
  tasks: Task[];
  selectedVenture: string | null;
  onSelectVenture: (id: string | null) => void;
  onSearchClick?: () => void;
  onMemoryClick?: () => void;
  onClose?: () => void;
}

export function Sidebar({
  ventures,
  agents,
  tasks,
  selectedVenture,
  onSelectVenture,
  onSearchClick,
  onMemoryClick,
  onClose
}: SidebarProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  const handleVentureSelect = (id: string | null) => {
    onSelectVenture(id);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      onClose?.();
    }
  };

  const handleClose = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Close button clicked!'); // Debug log
    onClose?.();
  };

  return (
    <aside className="h-full w-[85vw] max-w-[280px] md:w-[280px] bg-zinc-900 border-r border-zinc-800 overflow-y-auto custom-scrollbar">
      {/* Close button for mobile */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-50">
        <h2 className="text-sm font-bold text-zinc-100">Menu</h2>
        <button
          type="button"
          onClick={handleClose}
          onTouchEnd={handleClose}
          className="p-2.5 text-zinc-100 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors active:scale-95 cursor-pointer touch-manipulation"
          aria-label="Close sidebar"
        >
          <svg className="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-4 space-y-6 md:pt-20"
      >
        {/* Ventures Section */}
        <motion.section variants={itemVariants}>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2">
            Ventures
          </h2>
          <VentureList
            ventures={ventures}
            tasks={tasks}
            selectedId={selectedVenture}
            onSelect={handleVentureSelect}
          />
        </motion.section>

        {/* Agents Section */}
        <motion.section variants={itemVariants}>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2">
            Agents
          </h2>
          <AgentList agents={agents} />
        </motion.section>

        {/* Tools Section */}
        <motion.section variants={itemVariants}>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2">
            Tools
          </h2>
          <div className="space-y-1">
            <button
              onClick={() => {
                onSearchClick?.();
                if (window.innerWidth < 768) onClose?.();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors flex items-center gap-2 group"
            >
              <span>Search</span>
            </button>
            <button
              onClick={() => {
                onMemoryClick?.();
                if (window.innerWidth < 768) onClose?.();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors flex items-center gap-2 group"
            >
              <span>Memory</span>
            </button>
          </div>
        </motion.section>
      </motion.div>
    </aside>
  );
}
