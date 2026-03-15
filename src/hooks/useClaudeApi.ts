import { useState } from 'react';
import OpenAI from 'openai';
import type { Task } from '../types/task';

export interface ApiSettings {
  apiKey: string;
  baseURL: string;
  model: string;
}

export function useClaudeApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decomposeTask(
    taskTitle: string,
    settings: ApiSettings
  ): Promise<Omit<Task, 'id' | 'children' | 'completed' | 'isExpanded'>[]> {
    setLoading(true);
    setError(null);
    try {
      const client = new OpenAI({
        apiKey: settings.apiKey,
        baseURL: settings.baseURL,
        dangerouslyAllowBrowser: true,
      });

      const prompt = `将以下任务分解为 3-6 个具体、可执行的子任务。
任务：${taskTitle}

以 JSON 数组格式返回，每项包含：
- title: 子任务标题（简洁清晰）
- estimatedMinutes: 预估完成时间（分钟，整数）
- description: 简短说明（可选）

只返回 JSON 数组，不要其他文字。`;

      const response = await client.chat.completions.create({
        model: settings.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
      });

      const text = response.choices[0]?.message?.content?.trim() ?? '';
      const jsonText = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      const parsed = JSON.parse(jsonText) as {
        title: string;
        estimatedMinutes: number;
        description?: string;
      }[];

      return parsed.map((item) => ({
        title: item.title,
        estimatedMinutes: item.estimatedMinutes,
        description: item.description,
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { decomposeTask, loading, error };
}
