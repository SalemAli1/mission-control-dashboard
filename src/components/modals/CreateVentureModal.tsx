'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Venture } from '@/types';
import { Rocket } from 'lucide-react';

interface CreateVentureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (ventureData: Partial<Venture>) => void;
}

export function CreateVentureModal({
  isOpen,
  onClose,
  onCreate,
}: CreateVentureModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🚀');

  const handleCreate = () => {
    if (!name.trim()) return;

    onCreate({
      name,
      description,
      icon,
      status: 'active',
      priority: 'medium',
      capitalAllocated: 0,
      totalTasks: 0,
      activeTasks: 0,
      completedTasks: 0,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      color: '#3B82F6', // Default blue
    });

    // Reset form
    setName('');
    setDescription('');
    setIcon('🚀');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-zinc-950 border-zinc-800 text-zinc-100 z-[100]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Rocket className="w-5 h-5 text-blue-500" />
            New Venture
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="v-icon" className="text-zinc-400">Icon (Emoji)</Label>
            <Input
              id="v-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="bg-zinc-900 border-zinc-700 w-12 text-center text-xl"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="v-name" className="text-zinc-400">Venture Name*</Label>
            <Input
              id="v-name"
              placeholder="e.g., Project X"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-900 border-zinc-700"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="v-desc" className="text-zinc-400">Description</Label>
            <Textarea
              id="v-desc"
              placeholder="What is this venture about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-900 border-zinc-700 min-h-[60px]"
            />
          </div>
        </div>

        <DialogFooter className="border-t border-zinc-800 pt-4">
          <Button variant="ghost" onClick={onClose} className="text-zinc-400">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            Create Venture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
