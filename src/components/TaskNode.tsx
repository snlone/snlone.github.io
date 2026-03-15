import { useState, useRef, useEffect } from 'react';
import type { Task } from '../types/task';
import { getSubtreeProgress, formatMinutes } from '../utils/taskHelpers';

interface Props {
  task: Task;
  depth?: number;
  onToggleComplete: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string, title: string) => void;
  onDecomposeChild: (parentId: string, title: string) => void;
  isDecomposing?: boolean;
}

export function TaskNode({
  task,
  depth = 0,
  onToggleComplete,
  onToggleExpand,
  onUpdate,
  onDelete,
  onAddChild,
  onDecomposeChild,
  isDecomposing = false,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [addingChild, setAddingChild] = useState(false);
  const [newChildTitle, setNewChildTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const childInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    if (addingChild) childInputRef.current?.focus();
  }, [addingChild]);

  function commitEdit() {
    const t = editTitle.trim();
    if (t && t !== task.title) onUpdate(task.id, { title: t });
    else setEditTitle(task.title);
    setIsEditing(false);
  }

  function handleEditKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitEdit();
    else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  }

  function submitNewChild() {
    const t = newChildTitle.trim();
    if (t) {
      onAddChild(task.id, t);
      setNewChildTitle('');
    }
    setAddingChild(false);
  }

  function handleChildKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') submitNewChild();
    else if (e.key === 'Escape') {
      setNewChildTitle('');
      setAddingChild(false);
    }
  }

  const hasChildren = task.children.length > 0;
  const subtreeProgress = hasChildren ? getSubtreeProgress(task) : null;
  const subtreePercent =
    subtreeProgress && subtreeProgress.total > 0
      ? Math.round((subtreeProgress.completed / subtreeProgress.total) * 100)
      : 0;

  const indentClass = depth > 0 ? 'ml-6 border-l border-gray-200 pl-4' : '';

  return (
    <div className={`${indentClass} group/node`}>
      <div
        className={`flex items-start gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors ${
          task.completed ? 'opacity-60' : ''
        }`}
      >
        {/* Expand toggle */}
        <button
          onClick={() => hasChildren && onToggleExpand(task.id)}
          className={`mt-0.5 w-4 h-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-transform ${
            hasChildren ? 'cursor-pointer' : 'invisible'
          } ${task.isExpanded ? 'rotate-90' : ''}`}
        >
          ▶
        </button>

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="mt-1 flex-shrink-0 w-4 h-4 accent-indigo-600 cursor-pointer"
        />

        {/* Title */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleEditKeyDown}
              className="w-full text-sm border-b border-indigo-400 focus:outline-none bg-transparent py-0.5"
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className={`text-sm cursor-text select-none leading-snug ${
                task.completed ? 'line-through text-gray-400' : 'text-gray-800'
              }`}
            >
              {task.title}
            </span>
          )}

          {task.description && !isEditing && (
            <p className="text-xs text-gray-400 mt-0.5 leading-snug">{task.description}</p>
          )}

          {/* Subtree progress bar */}
          {hasChildren && !task.isExpanded && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden max-w-[120px]">
                <div
                  className="bg-indigo-400 h-1.5 rounded-full transition-all"
                  style={{ width: `${subtreePercent}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">
                {subtreeProgress?.completed}/{subtreeProgress?.total}
              </span>
            </div>
          )}
        </div>

        {/* Time badge */}
        {task.estimatedMinutes != null && (
          <span className="flex-shrink-0 text-xs bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-0.5 font-medium">
            {formatMinutes(task.estimatedMinutes)}
          </span>
        )}

        {/* Action buttons */}
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover/node:opacity-100 transition-opacity">
          <button
            onClick={() => onDecomposeChild(task.id, task.title)}
            disabled={isDecomposing}
            title="AI 分解此任务"
            className="text-xs bg-indigo-50 hover:bg-indigo-100 disabled:opacity-40 text-indigo-600 rounded px-2 py-0.5 font-medium transition-colors"
          >
            {isDecomposing ? '…' : '✦ AI'}
          </button>
          <button
            onClick={() => setAddingChild(true)}
            title="添加子任务"
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded px-2 py-0.5 font-medium transition-colors"
          >
            + 子任务
          </button>
          <button
            onClick={() => onDelete(task.id)}
            title="删除任务"
            className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 rounded px-1.5 py-0.5 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* New child input */}
      {addingChild && (
        <div className="ml-10 mr-2 mt-1 mb-1">
          <input
            ref={childInputRef}
            value={newChildTitle}
            onChange={(e) => setNewChildTitle(e.target.value)}
            onBlur={submitNewChild}
            onKeyDown={handleChildKeyDown}
            placeholder="输入子任务名称，Enter 确认…"
            className="w-full text-sm border border-indigo-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      )}

      {/* Children */}
      {hasChildren && task.isExpanded && (
        <div className="mt-0.5">
          {task.children.map((child) => (
            <TaskNode
              key={child.id}
              task={child}
              depth={depth + 1}
              onToggleComplete={onToggleComplete}
              onToggleExpand={onToggleExpand}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onDecomposeChild={onDecomposeChild}
              isDecomposing={isDecomposing}
            />
          ))}
        </div>
      )}
    </div>
  );
}
