import type { Task, TaskTree } from '../types/task';

export interface ProgressStats {
  total: number;
  completed: number;
  totalMinutes: number;
  completedMinutes: number;
  percentage: number;
}

function countTasks(tasks: TaskTree): { total: number; completed: number } {
  let total = 0;
  let completed = 0;
  for (const task of tasks) {
    const isLeaf = task.children.length === 0;
    if (isLeaf) {
      total += 1;
      if (task.completed) completed += 1;
    } else {
      const sub = countTasks(task.children);
      total += sub.total;
      completed += sub.completed;
    }
  }
  return { total, completed };
}

function sumMinutes(tasks: TaskTree): { total: number; completed: number } {
  let total = 0;
  let completed = 0;
  for (const task of tasks) {
    const isLeaf = task.children.length === 0;
    if (isLeaf) {
      const mins = task.estimatedMinutes ?? 0;
      total += mins;
      if (task.completed) completed += mins;
    } else {
      const sub = sumMinutes(task.children);
      total += sub.total;
      completed += sub.completed;
    }
  }
  return { total, completed };
}

export function getProgressStats(tasks: TaskTree): ProgressStats {
  const counts = countTasks(tasks);
  const minutes = sumMinutes(tasks);
  const percentage = counts.total === 0 ? 0 : Math.round((counts.completed / counts.total) * 100);
  return {
    total: counts.total,
    completed: counts.completed,
    totalMinutes: minutes.total,
    completedMinutes: minutes.completed,
    percentage,
  };
}

export function getSubtreeProgress(task: Task): { completed: number; total: number } {
  if (task.children.length === 0) {
    return { completed: task.completed ? 1 : 0, total: 1 };
  }
  return countTasks(task.children);
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}
