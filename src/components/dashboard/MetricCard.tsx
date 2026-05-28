import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

interface MetricCardProps {
  label: string;
  value: string;
  subvalue?: string;
  trend?: number; // positive = improvement (configurable)
  trendLabel?: string;
  trendPositiveIsGood?: boolean;
  icon?: React.ReactNode;
}

export function MetricCard({
  label,
  value,
  subvalue,
  trend,
  trendLabel,
  trendPositiveIsGood = true,
  icon,
}: MetricCardProps) {
  const isGood = trend !== undefined
    ? trendPositiveIsGood ? trend > 0 : trend < 0
    : null;

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="mb-1.5 text-xs font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-slate-100">{value}</p>
          {subvalue && <p className="mt-0.5 text-xs text-slate-600">{subvalue}</p>}
          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className={cn(
                  'size-3',
                  trend > 0 ? 'rotate-0' : 'rotate-180',
                  isGood ? 'text-emerald-400' : 'text-red-400',
                )}
              >
                <path fillRule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z" clipRule="evenodd" />
              </svg>
              <span className={cn('text-xs font-medium', isGood ? 'text-emerald-400' : 'text-red-400')}>
                {Math.abs(trend)}% {trendLabel ?? 'vs mes anterior'}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-slate-500">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
