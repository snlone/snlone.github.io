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

  const paddingLeft = depth > 0 ? `${depth * 20 + 12}px` : '8px';

  return (
    <div className="group/node">
      <div
        className={`flex items-start gap-2.5 py-2 rounded-xl hover:bg-claude-surface-hover transition-colors relative ${
          task.completed ? 'opacity-50' : ''
        }`}
        style={{ paddingLeft, paddingRight: '8px' }}
      >
        {/* Depth indicator line */}
        {depth > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 w-px bg-claude-border-light"
            style={{ left: `${depth * 20 - 1}px` }}
          />
        )}

        {/* Expand toggle */}
        <button
          onClick={() => hasChildren && onToggleExpand(task.id)}
          className={`mt-0.5 w-4 h-4 flex-shrink-0 flex items-center justify-center text-claude-text-faint hover:text-claude-text-muted transition-all text-[9px] ${
            hasChildren ? 'cursor-pointer' : 'invisible'
          } ${task.isExpanded ? 'rotate-90' : ''}`}
          style={{ transition: 'transform 0.15s ease, color 0.15s ease' }}
        >
          ▶
        </button>

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="mt-0.5"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleEditKeyDown}
              className="w-full text-sm border-b border-claude-orange focus:outline-none bg-transparent py-0.5 text-claude-text"
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className={`text-sm cursor-text leading-snug block ${
                task.completed
                  ? 'line-through text-claude-text-muted'
                  : depth === 0
                  ? 'text-claude-text font-medium'
                  : 'text-claude-text'
              }`}
            >
              {task.title}
            </span>
          )}

          {task.description && !isEditing && (
            <p className="text-xs text-claude-text-muted mt-0.5 leading-relaxed">{task.description}</p>
          )}

          {/* Collapsed subtree progress */}
          {hasChildren && !task.isExpanded && (
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 bg-claude-border-light rounded-full h-1 overflow-hidden max-w-[100px]">
                <div
                  className="bg-claude-orange h-1 rounded-full"
                  style={{ width: `${subtreePercent}%`, transition: 'width 0.4s ease' }}
                />
              </div>
              <span className="text-[11px] text-claude-text-faint tabular-nums">
                {subtreeProgress?.completed}/{subtreeProgress?.total}
              </span>
            </div>
          )}
        </div>

        {/* Time badge */}
        {task.estimatedMinutes != null && (
          <span className="flex-shrink-0 text-[11px] bg-claude-orange-subtle text-claude-orange border border-claude-orange/15 rounded-full px-2 py-0.5 font-medium mt-0.5 tabular-nums">
            {formatMinutes(task.estimatedMinutes)}
          </span>
        )}

        {/* Action buttons — appear on hover */}
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover/node:opacity-100 transition-opacity mt-0.5">
          <button
            onClick={() => onDecomposeChild(task.id, task.title)}
            disabled={isDecomposing}
            title="AI 分解此任务"
            className="text-[11px] font-semibold bg-claude-orange-subtle hover:bg-claude-orange-light disabled:opacity-40 text-claude-orange rounded-md px-2 py-0.5 transition-colors whitespace-nowrap"
          >
            {isDecomposing ? (
              <span className="shimmer-text">…</span>
            ) : '✦ AI'}
          </button>
          <button
            onClick={() => setAddingChild(true)}
            title="添加子任务"
            className="text-[11px] text-claude-text-muted hover:text-claude-text-secondary hover:bg-claude-surface-hover rounded-md px-2 py-0.5 transition-colors"
          >
            + 子任务
          </button>
          <button
            onClick={() => onDelete(task.id)}
            title="删除"
            className="text-[11px] text-claude-text-faint hover:text-red-400 rounded-md px-1.5 py-0.5 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* New child input */}
      {addingChild && (
        <div className="mt-1 mb-1" style={{ paddingLeft: `${(depth + 1) * 20 + 28}px`, paddingRight: '8px' }}>
          <input
            ref={childInputRef}
            value={newChildTitle}
            onChange={(e) => setNewChildTitle(e.target.value)}
            onBlur={submitNewChild}
            onKeyDown={handleChildKeyDown}
            placeholder="输入子任务名称，Enter 确认…"
            className="w-full text-sm border border-claude-border rounded-lg px-3 py-1.5 text-claude-text bg-claude-bg placeholder:text-claude-text-faint focus:outline-none focus:ring-2 focus:ring-claude-orange/20 focus:border-claude-orange transition-colors"
          />
        </div>
      )}

      {/* Children */}
      {hasChildren && task.isExpanded && (
        <div>
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
