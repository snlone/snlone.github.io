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
      handleAdd();
    }
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入一个大任务，如：开发一个博客网站..."
        className="flex-1 border border-claude-border rounded-lg px-4 py-2.5 text-sm text-claude-text bg-claude-bg placeholder:text-claude-text-muted focus:outline-none focus:ring-2 focus:ring-claude-orange/40 focus:border-claude-orange transition-colors"
      />
      <button
        onClick={handleAdd}
        disabled={!title.trim()}
        className="bg-claude-surface-hover hover:bg-claude-border-light disabled:opacity-40 text-claude-text-secondary font-medium px-4 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap border border-claude-border"
      >
        + 添加任务
      </button>
      <button
        onClick={handleDecompose}
        disabled={!title.trim() || isLoading}
        className="bg-claude-orange hover:bg-claude-orange-hover disabled:opacity-40 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            AI 分解中…
          </>
        ) : (
          '✦ AI 分解'
        )}
      </button>
    </div>
  );
}
