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

  const presets = [
    { label: 'DeepSeek', url: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
    { label: '硅基流动', url: 'https://api.siliconflow.cn/v1', model: 'deepseek-ai/DeepSeek-V3' },
    { label: 'Groq', url: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile' },
  ];

  return (
    <div className="fixed inset-0 bg-claude-text/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-claude-surface rounded-3xl shadow-modal border border-claude-border w-full max-w-md overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-claude-border-light">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-claude-orange text-xl">✦</span>
            <span className="font-display text-2xl font-medium text-claude-text">配置 AI 接口</span>
          </div>
          <p className="text-sm text-claude-text-muted leading-relaxed">
            支持任意兼容 OpenAI 格式的接口。配置仅保存在本地浏览器中，不会上传到任何服务器。
          </p>
        </div>

        {/* Quick presets */}
        <div className="px-8 pt-5 pb-2">
          <p className="text-xs font-medium text-claude-text-muted mb-2.5 uppercase tracking-wider">快速选择</p>
          <div className="flex gap-2 flex-wrap">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => { setBaseURL(p.url); setModel(p.model); }}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  baseURL === p.url
                    ? 'bg-claude-orange-subtle border-claude-orange/30 text-claude-orange font-medium'
                    : 'bg-claude-bg border-claude-border text-claude-text-secondary hover:border-claude-orange/30 hover:text-claude-orange'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-claude-text-secondary mb-1.5 uppercase tracking-wider">Base URL</label>
            <input
              type="text"
              value={baseURL}
              onChange={(e) => setBaseURL(e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="w-full border border-claude-border rounded-xl px-4 py-2.5 text-sm text-claude-text bg-claude-bg placeholder:text-claude-text-faint focus:outline-none focus:ring-2 focus:ring-claude-orange/20 focus:border-claude-orange transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-claude-text-secondary mb-1.5 uppercase tracking-wider">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="gpt-4o-mini / deepseek-chat / …"
              className="w-full border border-claude-border rounded-xl px-4 py-2.5 text-sm text-claude-text bg-claude-bg placeholder:text-claude-text-faint focus:outline-none focus:ring-2 focus:ring-claude-orange/20 focus:border-claude-orange transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-claude-text-secondary mb-1.5 uppercase tracking-wider">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-…"
              className="w-full border border-claude-border rounded-xl px-4 py-2.5 text-sm text-claude-text bg-claude-bg placeholder:text-claude-text-faint focus:outline-none focus:ring-2 focus:ring-claude-orange/20 focus:border-claude-orange transition-colors"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!isValid}
            className="w-full bg-claude-orange hover:bg-claude-orange-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all shadow-sm hover:shadow mt-2"
          >
            开始使用
          </button>
        </form>
      </div>
    </div>
  );
}
