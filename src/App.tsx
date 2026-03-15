import { useState } from 'react';
import { ApiKeySetup } from './components/ApiKeySetup';
import { TaskInput } from './components/TaskInput';
import { TaskNode } from './components/TaskNode';
import { ProgressSummary } from './components/ProgressSummary';
import { useTaskStore } from './hooks/useTaskStore';
import { useClaudeApi } from './hooks/useClaudeApi';
import type { ApiSettings } from './hooks/useClaudeApi';
import { getProgressStats } from './utils/taskHelpers';

const SETTINGS_KEY = 'task-decomposer-settings';

function loadSettings(): ApiSettings | null {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw) as ApiSettings;
  } catch {
    // ignore
  }
  return null;
}

export default function App() {
  const [settings, setSettings] = useState<ApiSettings | null>(loadSettings);
  const { tasks, dispatch } = useTaskStore();
  const { decomposeTask } = useClaudeApi();
  const [decomposingId, setDecomposingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const stats = getProgressStats(tasks);

  function handleSaveSettings(s: ApiSettings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    setSettings(s);
  }

  function handleResetSettings() {
    localStorage.removeItem(SETTINGS_KEY);
    setSettings(null);
  }

  function handleAddRootTask(title: string) {
    dispatch({ type: 'ADD_TASK', payload: { parentId: null, title } });
  }

  async function handleDecomposeNew(title: string) {
    if (!settings) return;
    setDecomposingId('__new__');
    setErrorMsg(null);
    try {
      const children = await decomposeTask(title, settings);
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
    if (!settings) return;
    setDecomposingId(parentId);
    setErrorMsg(null);
    try {
      const children = await decomposeTask(title, settings);
      dispatch({ type: 'ADD_CHILDREN', payload: { parentId, children } });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setDecomposingId(null);
    }
  }

  const isDecomposing = decomposingId !== null;

  return (
    <>
      {!settings && <ApiKeySetup onSave={handleSaveSettings} />}

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">任务分解助手</h1>
              <p className="text-gray-500 text-sm mt-1">
                {settings ? (
                  <span className="text-gray-400">
                    模型：<span className="font-medium text-gray-600">{settings.model}</span>
                  </span>
                ) : (
                  '将大任务拆解为可执行的小步骤'
                )}
              </p>
            </div>
            <button
              onClick={handleResetSettings}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              重设接口配置
            </button>
          </div>

          {/* Progress summary */}
          {tasks.length > 0 && <ProgressSummary stats={stats} />}

          {/* Task input */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <TaskInput
              onAdd={handleAddRootTask}
              onDecompose={handleDecomposeNew}
              isLoading={isDecomposing}
            />
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 flex items-start gap-2">
              <span className="flex-shrink-0 mt-0.5">⚠</span>
              <div>
                <p className="font-semibold">AI 分解失败</p>
                <p className="mt-0.5 text-red-600">{errorMsg}</p>
              </div>
              <button
                onClick={() => setErrorMsg(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          )}

          {/* Task list */}
          {tasks.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-1">
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
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-4">✦</p>
              <p className="text-lg font-medium text-gray-500">还没有任何任务</p>
              <p className="text-sm mt-1">在上方输入一个大目标，点击「✦ AI 分解」开始</p>
            </div>
          )}

          {/* Clear all */}
          {tasks.length > 0 && (
            <div className="text-center">
              <button
                onClick={() => {
                  if (confirm('确定要清空所有任务吗？')) {
                    dispatch({ type: 'SET_TREE', payload: [] });
                  }
                }}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                清空所有任务
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
