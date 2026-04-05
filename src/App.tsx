import { useState } from 'react';
import { TaskInput } from './components/TaskInput';
import { TaskNode } from './components/TaskNode';
import { ProgressSummary } from './components/ProgressSummary';
import { useTaskStore } from './hooks/useTaskStore';
import { decomposeTask, getModel } from './lib/ai';
import { getProgressStats } from './utils/taskHelpers';

export default function App() {
  const { tasks, dispatch } = useTaskStore();
  const [decomposingId, setDecomposingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const stats = getProgressStats(tasks);
  const isDecomposing = decomposingId !== null;

  function handleAddRootTask(title: string) {
    dispatch({ type: 'ADD_TASK', payload: { parentId: null, title } });
  }

  async function handleDecomposeNew(title: string) {
    setDecomposingId('__new__');
    setErrorMsg(null);
    try {
      const children = await decomposeTask(title);
      dispatch({
        type: 'SET_TREE',
        payload: [
          ...tasks,
          {
            id: crypto.randomUUID(),
            title,
            completed: false,
            isExpanded: true,
            children: children.map((c) => ({
              id: crypto.randomUUID(),
              title: c.title,
              description: c.description,
              estimatedMinutes: c.estimatedMinutes,
              completed: false,
              isExpanded: true,
              children: [],
            })),
          },
        ],
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setDecomposingId(null);
    }
  }

  async function handleDecomposeChild(parentId: string, title: string) {
    setDecomposingId(parentId);
    setErrorMsg(null);
    try {
      const children = await decomposeTask(title);
      dispatch({ type: 'ADD_CHILDREN', payload: { parentId, children } });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setDecomposingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-claude-bg">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-claude-bg/80 backdrop-blur-md border-b border-claude-border-light">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-claude-orange text-lg leading-none select-none">✦</span>
            <span className="font-display text-xl font-medium text-claude-text tracking-wide">
              任务分解助手
            </span>
          </div>
          <span className="text-xs text-claude-text-muted hidden sm:block">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 align-middle" />
            {getModel()}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-20">
        {/* Hero — only when no tasks */}
        {tasks.length === 0 && (
          <div className="pt-20 pb-10 text-center animate-fade-up">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-claude-orange-subtle mb-6 shadow-sm">
              <span className="text-2xl text-claude-orange">✦</span>
            </div>
            <h2 className="font-display text-4xl font-medium text-claude-text mb-3 tracking-wide leading-tight">
              将大目标拆解为<br />
              <em className="not-italic text-claude-orange">可执行的步骤</em>
            </h2>
            <p className="text-sm text-claude-text-muted max-w-xs mx-auto leading-relaxed">
              输入任何复杂目标，AI 会帮你分解成清晰的子任务，并估算所需时间
            </p>
          </div>
        )}

        {tasks.length > 0 && (
          <div className="pt-8 pb-4 animate-fade-up">
            <ProgressSummary stats={stats} />
          </div>
        )}

        {/* Input */}
        <div className="animate-fade-up" style={{ animationDelay: '0.05s' }}>
          <TaskInput
            onAdd={handleAddRootTask}
            onDecompose={handleDecomposeNew}
            isLoading={isDecomposing}
          />
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mt-4 bg-red-50 border border-red-200/80 text-red-700 text-sm rounded-xl px-4 py-3.5 flex items-start gap-3 animate-fade-up">
            <span className="flex-shrink-0 mt-0.5 text-red-400">⚠</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-red-700">AI 分解失败</p>
              <p className="mt-0.5 text-red-500 text-xs leading-relaxed">{errorMsg}</p>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-red-300 hover:text-red-500 transition-colors flex-shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* Task list */}
        {tasks.length > 0 && (
          <div className="mt-4 bg-claude-surface rounded-2xl shadow-card overflow-hidden animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="px-2 py-2 space-y-0.5">
              {tasks.map((task) => (
                <TaskNode
                  key={task.id}
                  task={task}
                  depth={0}
                  onToggleComplete={(id) =>
                    dispatch({ type: 'TOGGLE_COMPLETE', payload: { id } })
                  }
                  onToggleExpand={(id) =>
                    dispatch({ type: 'TOGGLE_EXPAND', payload: { id } })
                  }
                  onUpdate={(id, updates) =>
                    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } })
                  }
                  onDelete={(id) => dispatch({ type: 'DELETE_TASK', payload: { id } })}
                  onAddChild={(parentId, title) =>
                    dispatch({ type: 'ADD_TASK', payload: { parentId, title } })
                  }
                  onDecomposeChild={handleDecomposeChild}
                  isDecomposing={isDecomposing && decomposingId === task.id}
                />
              ))}
            </div>

            <div className="border-t border-claude-border-light px-4 py-3 flex justify-end">
              <button
                onClick={() => {
                  if (confirm('确定要清空所有任务吗？')) {
                    dispatch({ type: 'SET_TREE', payload: [] });
                  }
                }}
                className="text-xs text-claude-text-faint hover:text-red-400 transition-colors"
              >
                清空所有任务
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
