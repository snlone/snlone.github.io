import { useState } from 'react';

interface Props {
  onAdd: (title: string) => void;
  onDecompose: (title: string) => void;
  isLoading: boolean;
}

export function TaskInput({ onAdd, onDecompose, isLoading }: Props) {
  const [title, setTitle] = useState('');

  function handleAdd() {
    const t = title.trim();
    if (!t) return;
    onAdd(t);
    setTitle('');
  }

  function handleDecompose() {
    const t = title.trim();
    if (!t) return;
    onDecompose(t);
    setTitle('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleDecompose();
    }
  }

  const hasValue = title.trim().length > 0;

  return (
    <div className="bg-claude-surface rounded-2xl shadow-card overflow-hidden">
      {/* Input row */}
      <div className="flex items-center gap-0 px-4 pt-4 pb-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入一个大任务，如：开发一个博客网站…"
          className="flex-1 text-sm text-claude-text bg-transparent placeholder:text-claude-text-faint focus:outline-none leading-relaxed py-1"
          autoFocus
        />
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-claude-border-light" />

      {/* Action row */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <p className="text-xs text-claude-text-faint hidden sm:block">
          Enter 快速分解 · Shift+Enter 换行
        </p>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleAdd}
            disabled={!hasValue}
            className="text-xs font-medium text-claude-text-secondary hover:text-claude-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-lg hover:bg-claude-surface-hover"
          >
            + 手动添加
          </button>
          <button
            onClick={handleDecompose}
            disabled={!hasValue || isLoading}
            className="flex items-center gap-1.5 text-xs font-semibold bg-claude-orange hover:bg-claude-orange-hover disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg transition-all shadow-sm hover:shadow"
          >
            {isLoading ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>分解中…</span>
              </>
            ) : (
              <>
                <span className="text-[11px]">✦</span>
                <span>AI 分解</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
