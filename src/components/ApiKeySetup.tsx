import { useState } from 'react';
import type { ApiSettings } from '../hooks/useClaudeApi';

interface Props {
  onSave: (settings: ApiSettings) => void;
}

export function ApiKeySetup({ onSave }: Props) {
  const [apiKey, setApiKey] = useState('');
  const [baseURL, setBaseURL] = useState('https://api.openai.com/v1');
  const [model, setModel] = useState('gpt-4o-mini');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey.trim() || !baseURL.trim() || !model.trim()) return;
    onSave({ apiKey: apiKey.trim(), baseURL: baseURL.trim(), model: model.trim() });
  }

  const isValid = apiKey.trim() && baseURL.trim() && model.trim();

  return (
    <div className="fixed inset-0 bg-claude-text/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-claude-surface rounded-2xl shadow-xl border border-claude-border p-8 w-full max-w-md">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-claude-text mb-1.5">配置 AI 接口</h2>
          <p className="text-claude-text-muted text-sm leading-relaxed">
            支持任意兼容 OpenAI 格式的接口（如 DeepSeek、硅基流动、Groq 等）。配置仅保存在本地浏览器中。
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-claude-text-secondary mb-1.5">Base URL</label>
            <input
              type="text"
              value={baseURL}
              onChange={(e) => setBaseURL(e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="w-full border border-claude-border rounded-lg px-4 py-2.5 text-sm text-claude-text bg-claude-bg placeholder:text-claude-text-muted focus:outline-none focus:ring-2 focus:ring-claude-orange/40 focus:border-claude-orange transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-claude-text-secondary mb-1.5">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="gpt-4o-mini / deepseek-chat / ..."
              className="w-full border border-claude-border rounded-lg px-4 py-2.5 text-sm text-claude-text bg-claude-bg placeholder:text-claude-text-muted focus:outline-none focus:ring-2 focus:ring-claude-orange/40 focus:border-claude-orange transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-claude-text-secondary mb-1.5">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full border border-claude-border rounded-lg px-4 py-2.5 text-sm text-claude-text bg-claude-bg placeholder:text-claude-text-muted focus:outline-none focus:ring-2 focus:ring-claude-orange/40 focus:border-claude-orange transition-colors"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!isValid}
            className="w-full bg-claude-orange hover:bg-claude-orange-hover disabled:opacity-40 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            开始使用
          </button>
        </form>
        <div className="mt-5 text-xs text-claude-text-muted space-y-1.5 border-t border-claude-border-light pt-4">
          <p className="font-medium text-claude-text-secondary">常用 Base URL：</p>
          <ul className="space-y-1 pl-1">
            <li>· DeepSeek：<code className="text-claude-text-secondary bg-claude-surface-hover px-1 py-0.5 rounded text-xs">https://api.deepseek.com/v1</code></li>
            <li>· 硅基流动：<code className="text-claude-text-secondary bg-claude-surface-hover px-1 py-0.5 rounded text-xs">https://api.siliconflow.cn/v1</code></li>
            <li>· Groq：<code className="text-claude-text-secondary bg-claude-surface-hover px-1 py-0.5 rounded text-xs">https://api.groq.com/openai/v1</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
