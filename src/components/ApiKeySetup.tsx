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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">配置 AI 接口</h2>
        <p className="text-gray-500 mb-6 text-sm">
          支持任意兼容 OpenAI 格式的接口（如 DeepSeek、硅基流动、Groq 等）。配置仅保存在本地浏览器中。
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Base URL</label>
            <input
              type="text"
              value={baseURL}
              onChange={(e) => setBaseURL(e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="gpt-4o-mini / deepseek-chat / ..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!isValid}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            开始使用
          </button>
        </form>
        <div className="mt-4 text-xs text-gray-400 space-y-1">
          <p>常用 Base URL：</p>
          <ul className="space-y-0.5 pl-2">
            <li>· DeepSeek：<code className="text-gray-500">https://api.deepseek.com/v1</code></li>
            <li>· 硅基流动：<code className="text-gray-500">https://api.siliconflow.cn/v1</code></li>
            <li>· Groq：<code className="text-gray-500">https://api.groq.com/openai/v1</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
