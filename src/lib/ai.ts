import OpenAI from 'openai';
import type { Task } from '../types/task';

const API_KEY = import.meta.env.VITE_API_KEY as string;
const BASE_URL = import.meta.env.VITE_BASE_URL as string;
const MODEL = import.meta.env.VITE_MODEL as string;

if (!API_KEY || API_KEY === 'your-api-key-here') {
  console.warn('[task-decomposer] 请在 .env 文件中填写 VITE_API_KEY');
}

const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: BASE_URL,
  dangerouslyAllowBrowser: true,
});

export async function decomposeTask(
  taskTitle: string
): Promise<Omit<Task, 'id' | 'children' | 'completed' | 'isExpanded'>[]> {
  const prompt = `将以下任务分解为 3-6 个具体、可执行的子任务。
任务：${taskTitle}

以 JSON 数组格式返回，每项包含：
- title: 子任务标题（简洁清晰）
- estimatedMinutes: 预估完成时间（分钟，整数）
- description: 简短说明（可选）

只返回 JSON 数组，不要其他文字。`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
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
}

export function getModel(): string {
  return MODEL;
}
