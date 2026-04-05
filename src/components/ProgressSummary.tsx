import type { ProgressStats } from '../utils/taskHelpers';
import { formatMinutes } from '../utils/taskHelpers';

interface Props {
  stats: ProgressStats;
}

export function ProgressSummary({ stats }: Props) {
  const { total, completed, totalMinutes, percentage } = stats;

  return (
    <div className="flex items-center gap-5 px-1">
      {/* Progress ring area */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20" cy="20" r="16"
            fill="none"
            stroke="#EFE8DF"
            strokeWidth="3"
          />
          <circle
            cx="20" cy="20" r="16"
            fill="none"
            stroke="#D97757"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 16}`}
            strokeDashoffset={`${2 * Math.PI * 16 * (1 - percentage / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1)' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-claude-orange tabular-nums">
          {percentage}
        </span>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-semibold text-claude-text tabular-nums">{completed}</span>
          <span className="text-xs text-claude-text-muted">/ {total} 个任务已完成</span>
        </div>
        {totalMinutes > 0 && (
          <p className="text-xs text-claude-text-muted">
            预估总用时&nbsp;
            <span className="font-medium text-claude-text-secondary">{formatMinutes(totalMinutes)}</span>
          </p>
        )}
      </div>

      {/* Progress bar - right side */}
      <div className="flex-1 hidden sm:block">
        <div className="w-full bg-claude-border-light rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-claude-orange h-1.5 rounded-full"
            style={{
              width: `${percentage}%`,
              transition: 'width 0.6s cubic-bezier(0.22,1,0.36,1)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
