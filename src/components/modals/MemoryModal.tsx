'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Brain, Construction } from 'lucide-react';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MemoryModal({ isOpen, onClose }: MemoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Brain className="w-5 h-5 text-purple-500" />
            Agent Memory
          </DialogTitle>
        </DialogHeader>

        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800">
            <Construction className="w-12 h-12 text-zinc-700 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-zinc-300">Memory Explorer Under Construction</h3>
            <p className="text-sm text-zinc-500 max-w-[300px] mt-2">
              This module will allow you to browse and manage the vector memory for all your agents.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
