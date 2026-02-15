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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '@/components/ui/select';
import { Venture, TaskPriority, Task } from '@/types';
import { Plus, Tag as TagIcon, X, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CreateVentureModal } from './CreateVentureModal';

interface CreateTaskModalProps {
  ventures: Venture[];
  isOpen: boolean;
  onClose: () => void;
  onCreate: (taskData: Partial<Task>) => void;
  onVentureCreate?: (ventureData: Partial<Venture>) => void;
}

export function CreateTaskModal({
  ventures,
  isOpen,
  onClose,
  onCreate,
  onVentureCreate,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ventureId, setVentureId] = useState(ventures[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [estimatedCost, setEstimatedCost] = useState('5.00');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isVentureModalOpen, setIsVentureModalOpen] = useState(false);

  const handleCreate = () => {
    if (!title.trim()) return;

    onCreate({
      title,
      description,
      ventureId,
      priority,
      estimatedCost: parseFloat(estimatedCost) || 0,
      tags,
      status: 'queue',
      createdAt: new Date(),
      createdBy: 'user',
      actualCost: 0,
      actualTokens: 0,
      estimatedTokens: parseFloat(estimatedCost) * 10000,
      blockedBy: [],
      blocks: [],
      assignedAgent: null,
      startedAt: null,
      completedAt: null,
      output: null,
      error: null,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setVentureId(ventures[0]?.id || '');
    setPriority('medium');
    setEstimatedCost('5.00');
    setTags([]);
    onClose();
  };

  const handleVentureSelect = (value: string) => {
    if (value === 'CREATE_NEW_VENTURE') {
      setIsVentureModalOpen(true);
    } else {
      setVentureId(value);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-500" />
              Create New Task
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-zinc-400">Task Title*</Label>
              <Input
                id="title"
                placeholder="e.g., Scrape product list"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-900 border-zinc-700 focus:ring-blue-500"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-zinc-400">Description</Label>
              <Textarea
                id="description"
                placeholder="What needs to be done?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-zinc-900 border-zinc-700 min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-zinc-400">Venture</Label>
                <Select value={ventureId} onValueChange={handleVentureSelect}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700">
                    <SelectValue placeholder="Select venture" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                    {ventures.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        <span className="flex items-center gap-2">
                          <span>{v.icon}</span>
                          <span className="truncate">{v.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                    <SelectSeparator className="bg-zinc-800" />
                    <SelectItem value="CREATE_NEW_VENTURE" className="text-blue-400 font-medium focus:bg-blue-500/10 focus:text-blue-300">
                      <span className="flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Create New Venture...
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-zinc-400">Priority</Label>
                <Select value={priority} onValueChange={(v: TaskPriority) => setPriority(v)}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cost" className="text-zinc-400">Estimated Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  className="bg-zinc-900 border-zinc-700"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-zinc-400">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    className="bg-zinc-900 border-zinc-700"
                  />
                  <Button variant="outline" size="icon" onClick={addTag} className="border-zinc-700 shrink-0">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-zinc-800 text-zinc-300 gap-1 pr-1">
                    <TagIcon className="w-3 h-3" />
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-400 ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-zinc-800 pt-4">
            <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-zinc-100">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!title.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <CreateVentureModal
        isOpen={isVentureModalOpen}
        onClose={() => setIsVentureModalOpen(false)}
        onCreate={(ventureData) => {
          if (onVentureCreate) {
            onVentureCreate(ventureData);
          }
          setIsVentureModalOpen(false);
        }}
      />
    </>
  );
}
