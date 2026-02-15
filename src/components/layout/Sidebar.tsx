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
    <aside className="h-full w-[85vw] max-w-[280px] md:w-[280px] bg-sidebar border-r border-white/5 overflow-y-auto custom-scrollbar flex flex-col">
      {/* Close button for mobile */}
      <div className="md:hidden flex justify-between items-center p-5 border-b border-white/5 bg-sidebar sticky top-0 z-50">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Navigation</h2>
        <button
          type="button"
          onClick={handleClose}
          onTouchEnd={handleClose}
          className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all active:scale-90"
          aria-label="Close sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-6 space-y-8 md:pt-24 flex-1"
      >
        {/* Ventures Section */}
        <motion.section variants={itemVariants}>
          <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-4 px-2 opacity-80">
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
          <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-4 px-2 opacity-80">
            Active Agents
          </h2>
          <AgentList agents={agents} />
        </motion.section>

        {/* Tools Section */}
        <motion.section variants={itemVariants}>
          <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-4 px-2 opacity-80">
            Utility
          </h2>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => {
                onSearchClick?.();
                if (window.innerWidth < 768) onClose?.();
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5 transition-all flex items-center gap-3 group"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-primary transition-colors" />
              <span className="uppercase tracking-widest">Global Search</span>
            </button>
            <button
              onClick={() => {
                onMemoryClick?.();
                if (window.innerWidth < 768) onClose?.();
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5 transition-all flex items-center gap-3 group"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-primary transition-colors" />
              <span className="uppercase tracking-widest">Core Memory</span>
            </button>
          </div>
        </motion.section>
      </motion.div>
    </aside>
  );
}
