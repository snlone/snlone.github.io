export interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedMinutes?: number;
  completed: boolean;
  children: Task[];
  isExpanded: boolean;
}

export type TaskTree = Task[];
