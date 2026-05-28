import { cn, formatConfidence, getConfidenceColor } from '@/lib/utils';

interface ConfidenceMeterProps {
  value: number; // 0-1
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function ConfidenceMeter({ value, showLabel = true, size = 'md' }: ConfidenceMeterProps) {
  const pct = Math.round(value * 100);
  const color = getConfidenceColor(value);
  const trackColor =
    value >= 0.8 ? 'bg-emerald-500' : value >= 0.6 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="flex items-center gap-3">
      <div className={cn('flex-1 rounded-full bg-white/[0.06]', size === 'sm' ? 'h-1' : 'h-1.5')}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', trackColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn('tabular-nums font-semibold', color, size === 'sm' ? 'text-xs' : 'text-sm')}>
          {formatConfidence(value)}
        </span>
      )}
    </div>
  );
}
