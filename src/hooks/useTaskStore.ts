import { useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskTree } from '../types/task';

const STORAGE_KEY = 'task-decomposer-data';

type Action =
  | { type: 'SET_TREE'; payload: TaskTree }
  | { type: 'ADD_TASK'; payload: { parentId: string | null; title: string } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'TOGGLE_COMPLETE'; payload: { id: string } }
  | { type: 'TOGGLE_EXPAND'; payload: { id: string } }
  | { type: 'ADD_CHILDREN'; payload: { parentId: string; children: Omit<Task, 'id' | 'children' | 'completed' | 'isExpanded'>[] } };

function createTask(title: string, extra?: Partial<Task>): Task {
  return {
    id: uuidv4(),
    title,
    completed: false,
    children: [],
    isExpanded: true,
    ...extra,
  };
}

function applyToTree(tasks: TaskTree, id: string, fn: (task: Task) => Task): TaskTree {
  return tasks.map((task) => {
    if (task.id === id) return fn(task);
    if (task.children.length > 0) {
      return { ...task, children: applyToTree(task.children, id, fn) };
    }
    return task;
  });
}

function deleteFromTree(tasks: TaskTree, id: string): TaskTree {
  return tasks
    .filter((t) => t.id !== id)
    .map((t) => ({ ...t, children: deleteFromTree(t.children, id) }));
}

function reducer(state: TaskTree, action: Action): TaskTree {
  switch (action.type) {
    case 'SET_TREE':
      return action.payload;

    case 'ADD_TASK': {
      const newTask = createTask(action.payload.title);
      if (action.payload.parentId === null) {
        return [...state, newTask];
      }
      return applyToTree(state, action.payload.parentId, (task) => ({
        ...task,
        children: [...task.children, newTask],
        isExpanded: true,
      }));
    }

    case 'DELETE_TASK':
      return deleteFromTree(state, action.payload.id);

    case 'UPDATE_TASK':
      return applyToTree(state, action.payload.id, (task) => ({
        ...task,
        ...action.payload.updates,
      }));

    case 'TOGGLE_COMPLETE':
      return applyToTree(state, action.payload.id, (task) => ({
        ...task,
        completed: !task.completed,
      }));

    case 'TOGGLE_EXPAND':
      return applyToTree(state, action.payload.id, (task) => ({
        ...task,
        isExpanded: !task.isExpanded,
      }));

    case 'ADD_CHILDREN':
      return applyToTree(state, action.payload.parentId, (task) => ({
        ...task,
        isExpanded: true,
        children: [
          ...task.children,
          ...action.payload.children.map((c) =>
            createTask(c.title, {
              description: c.description,
              estimatedMinutes: c.estimatedMinutes,
            })
          ),
        ],
      }));

    default:
      return state;
  }
}

function loadFromStorage(): TaskTree {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as TaskTree;
  } catch {
    // ignore
  }
  return [];
}

export function useTaskStore() {
  const [tasks, dispatch] = useReducer(reducer, undefined, loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  return { tasks, dispatch };
}
