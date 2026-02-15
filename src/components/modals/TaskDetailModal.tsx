'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Clock, 
  DollarSign, 
  Cpu, 
  Tag, 
  Play, 
  Trash2 
} from 'lucide-react';
import { Task, Venture, Agent } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TASK_STATUS_COLORS, PRIORITY_COLORS } from '@/lib/constants';

interface TaskDetailModalProps {
  task: Task | null;
  ventures: Venture[];
  agents: Agent[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  onStart: (taskId: string) => void;
}

export function TaskDetailModal({
  task,
  ventures,
  agents,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onStart,
}: TaskDetailModalProps) {
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (task) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditedTask(task);
      setIsEditing(false);
    }
  }, [task]);

  if (!task) return null;

  const venture = ventures.find((v) => v.id === task.ventureId);
  const agent = agents.find((a) => a.id === task.assignedAgent);

  const handleSave = () => {
    onUpdate(task.id, editedTask);
    setIsEditing(false);
  };

  const statusColor = TASK_STATUS_COLORS[task.status] || 'bg-zinc-500';
  const priorityColor = PRIORITY_COLORS[task.priority] || 'bg-zinc-500';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{venture?.icon || '📁'}</span>
              <DialogTitle className="text-xl font-bold">
                {isEditing ? (
                  <Input
                    value={editedTask.title || ''}
                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                    className="bg-zinc-900 border-zinc-700 h-8 mt-1"
                  />
                ) : (
                  task.title
                )}
              </DialogTitle>
            </div>
            <div className="flex gap-2">
              <Badge className={cn("capitalize", statusColor)}>{task.status}</Badge>
              <Badge variant="outline" className={cn("capitalize border-zinc-700", priorityColor)}>
                {task.priority}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Description */}
          <div className="grid gap-2">
            <Label className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Description</Label>
            {isEditing ? (
              <Textarea
                value={editedTask.description || ''}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                className="bg-zinc-900 border-zinc-700 min-h-[100px]"
              />
            ) : (
              <p className="text-zinc-300 text-sm leading-relaxed">
                {task.description || 'No description provided.'}
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <DollarSign className="w-3 h-3" />
                <span>CAPITAL</span>
              </div>
              <div className="text-sm font-medium">
                ${task.actualCost.toFixed(2)} <span className="text-zinc-500 text-xs">/ ${task.estimatedCost.toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <Cpu className="w-3 h-3" />
                <span>TOKENS</span>
              </div>
              <div className="text-sm font-medium">
                {(task.actualTokens / 1000).toFixed(1)}k <span className="text-zinc-500 text-xs">/ {(task.estimatedTokens / 1000).toFixed(1)}k</span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div className="grid gap-1">
              <Label className="text-zinc-500 text-xs">Venture</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-300">{venture?.name || 'Unknown'}</span>
              </div>
            </div>
            <div className="grid gap-1">
              <Label className="text-zinc-500 text-xs">Agent</Label>
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", agent ? "bg-green-500" : "bg-zinc-600")} />
                <span className="text-xs text-zinc-300">{agent?.name || 'Unassigned'}</span>
              </div>
            </div>
            <div className="grid gap-1">
              <Label className="text-zinc-500 text-xs">Created At</Label>
              <div className="flex items-center gap-2 text-zinc-300 text-xs">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>{format(task.createdAt, 'MMM d, yyyy HH:mm')}</span>
              </div>
            </div>
            <div className="grid gap-1">
              <Label className="text-zinc-500 text-xs">Created By</Label>
              <div className="capitalize text-zinc-300 text-xs">{task.createdBy}</div>
            </div>
          </div>

          {/* Output / Error */}
          {(task.output || task.error) && (
            <div className="grid gap-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-wider font-bold">
                {task.error ? 'Error Details' : 'Output'}
              </Label>
              <div className={cn(
                "p-3 rounded-lg border text-xs font-mono whitespace-pre-wrap max-h-[150px] overflow-y-auto",
                task.error ? "bg-red-950/20 border-red-900/50 text-red-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"
              )}>
                {task.error || task.output}
              </div>
            </div>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {task.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border-none text-[10px]">
                  <Tag className="w-2 h-2 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center border-t border-zinc-800 pt-4">
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="bg-red-950/30 text-red-500 hover:bg-red-950/50 border border-red-900/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
          <div className="flex gap-2">
            {task.status === 'queue' && (
              <Button
                size="sm"
                onClick={() => onStart(task.id)}
                className="bg-green-600 hover:bg-green-500 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Task
              </Button>
            ) }
            
            {isEditing ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900">Cancel</Button>
                <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white">Save Changes</Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-900">Edit Task</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
