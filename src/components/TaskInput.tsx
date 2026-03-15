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
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={handleAdd}
        disabled={!title.trim()}
        className="bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
      >
        + 添加任务
      </button>
      <button
        onClick={handleDecompose}
        disabled={!title.trim() || isLoading}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap flex items-center gap-2"
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
