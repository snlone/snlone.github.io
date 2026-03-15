import type { ProgressStats } from '../utils/taskHelpers';
import { formatMinutes } from '../utils/taskHelpers';

interface Props {
  stats: ProgressStats;
}

export function ProgressSummary({ stats }: Props) {
  const { total, completed, totalMinutes, percentage } = stats;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span className="font-semibold text-gray-800 text-base">总体进度</span>
        <span className="font-bold text-indigo-600 text-base">{percentage}%</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex gap-4 text-sm text-gray-500 flex-wrap">
        <span>
          已完成&nbsp;
          <span className="font-semibold text-gray-800">{completed}</span>
          &nbsp;/&nbsp;
          <span className="font-semibold text-gray-800">{total}</span>
          &nbsp;个任务
        </span>
        {totalMinutes > 0 && (
          <span>
            预估时间&nbsp;
            <span className="font-semibold text-gray-800">{formatMinutes(totalMinutes)}</span>
          </span>
        )}
      </div>
    </div>
  );
}
