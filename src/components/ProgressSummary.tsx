import type { ProgressStats } from '../utils/taskHelpers';
import { formatMinutes } from '../utils/taskHelpers';

interface Props {
  stats: ProgressStats;
}

export function ProgressSummary({ stats }: Props) {
  const { total, completed, totalMinutes, percentage } = stats;

  return (
    <div className="bg-claude-surface rounded-xl border border-claude-border p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-claude-text text-sm">总体进度</span>
        <span className="font-bold text-claude-orange text-base">{percentage}%</span>
      </div>

      <div className="w-full bg-claude-border-light rounded-full h-2 overflow-hidden">
        <div
          className="bg-claude-orange h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex gap-4 text-sm text-claude-text-muted flex-wrap">
        <span>
          已完成&nbsp;
          <span className="font-semibold text-claude-text">{completed}</span>
          &nbsp;/&nbsp;
          <span className="font-semibold text-claude-text">{total}</span>
          &nbsp;个任务
        </span>
        {totalMinutes > 0 && (
          <span>
            预估时间&nbsp;
            <span className="font-semibold text-claude-text">{formatMinutes(totalMinutes)}</span>
          </span>
        )}
      </div>
    </div>
  );
}
