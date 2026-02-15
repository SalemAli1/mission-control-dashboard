'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { ActivityFeed } from '@/components/activity/ActivityFeed';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { TaskDetailModal } from '@/components/modals/TaskDetailModal';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { SearchModal } from '@/components/modals/SearchModal';
import { MemoryModal } from '@/components/modals/MemoryModal';
import type { Venture, Agent, Task, Activity, TaskStatus } from '@/types';
import { taskMoved, createActivity } from '@/lib/activity-generator';

export default function DashboardPage() {
  // State management
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedVenture, setSelectedVenture] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch data from our database API
        const [venturesData, tasksData, agentsData, activitiesData] = await Promise.all([
          fetch('/api/ventures').then(r => r.json()),
          fetch('/api/tasks').then(r => r.json()),
          fetch('/api/agents').then(r => r.json()),
          fetch('/api/activities?limit=50').then(r => r.json())
        ]);

        setVentures(venturesData);
        setTasks(tasksData);
        setAgents(agentsData);
        setActivities(activitiesData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-refresh data every 5 seconds
  useEffect(() => {
    const refreshDashboardData = async () => {
      try {
        const [tasksData, agentsData, activitiesData] = await Promise.all([
          fetch('/api/tasks').then(r => r.json()),
          fetch('/api/agents').then(r => r.json()),
          fetch('/api/activities?limit=50').then(r => r.json())
        ]);

        setTasks(tasksData);
        setAgents(agentsData);
        setActivities(activitiesData);
        setLastSync(new Date());
      } catch (err) {
        console.error('Dashboard refresh failed:', err);
      }
    };

    const intervalId = setInterval(refreshDashboardData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Handle task move (drag & drop)
  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      
      const movedTask = updatedTasks.find((t) => t.id === taskId);
      if (movedTask) {
        const activity = taskMoved(movedTask, newStatus);
        setActivities((prev) => [activity, ...prev]);
      }
      
      return updatedTasks;
    });
  };

  // Handle task click
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  // Handle task update
  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)));
    if (selectedTask?.id === taskId) {
      setSelectedTask((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  // Handle task delete
  const handleTaskDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  // Handle task start
  const handleTaskStart = (taskId: string) => {
    handleTaskMove(taskId, 'active');
  };

  // Handle task create
  const handleTaskCreate = (taskData: Partial<Task>) => {
    const newTask = {
      ...taskData,
      id: `task-${Date.now()}`,
    } as Task;
    
    setTasks((prev) => [newTask, ...prev]);
    
    const activity = createActivity('taskCreated', { task: newTask });
    setActivities((prev) => [activity, ...prev]);
  };

  // Handle venture create
  const handleVentureCreate = (ventureData: Partial<Venture>) => {
    const newVenture = {
      ...ventureData,
      id: `venture-${Date.now()}`,
    } as Venture;
    
    setVentures((prev) => [...prev, newVenture]);
    
    const activity = createActivity('ventureCreated', { venture: newVenture });
    setActivities((prev) => [activity, ...prev]);
  };

  // Calculate capital used
  const capitalUsed = ventures.reduce((sum, v) => sum + (v.capitalSpent || 0), 0);
  const totalCapital = 200;

  // Determine agent status
  const agentStatus = agents.some((a) => a.status === 'busy')
    ? 'busy'
    : agents.some((a) => a.status === 'online')
    ? 'online'
    : 'offline';

  // Handle retry
  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={handleRetry} />;

  return (
    <MainLayout
      capital={totalCapital}
      capitalUsed={capitalUsed}
      agentStatus={agentStatus}
      lastSync={lastSync}
      ventures={ventures}
      agents={agents}
      tasks={tasks}
      selectedVenture={selectedVenture}
      onSelectVenture={setSelectedVenture}
      onSearchClick={() => setIsSearchModalOpen(true)}
      onMemoryClick={() => setIsMemoryModalOpen(true)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6"
      >
        <div className="lg:col-span-2">
          <KanbanBoard
            tasks={tasks}
            ventures={ventures}
            selectedVenture={selectedVenture}
            onTaskMove={handleTaskMove}
            onTaskClick={handleTaskClick}
            onCreateClick={() => setIsCreateModalOpen(true)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed activities={activities} />
        </div>
      </motion.div>

      <AnimatePresence>
        {isTaskModalOpen && (
          <TaskDetailModal
            task={selectedTask}
            ventures={ventures}
            agents={agents}
            isOpen={isTaskModalOpen}
            onClose={() => setIsTaskModalOpen(false)}
            onUpdate={handleTaskUpdate}
            onDelete={handleTaskDelete}
            onStart={handleTaskStart}
          />
        )}

        {isCreateModalOpen && (
          <CreateTaskModal
            ventures={ventures}
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={handleTaskCreate}
            onVentureCreate={handleVentureCreate}
          />
        )}
      </AnimatePresence>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      <MemoryModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
      />
    </MainLayout>
  );
}
