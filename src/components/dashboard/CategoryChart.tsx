import { CategoryStat } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatMTTR } from '@/lib/utils';

interface CategoryChartProps {
  data: CategoryStat[];
}

const COLORS = [
  'bg-indigo-500',
  'bg-violet-500',
  'bg-cyan-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
];

export function CategoryChart({ data }: CategoryChartProps) {
  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets por Categoría</CardTitle>
        <span className="text-xs text-slate-600">{data.reduce((s, d) => s + d.count, 0)} total</span>
      </CardHeader>
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={item.category}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-slate-400">{item.category}</span>
              <div className="flex items-center gap-3 text-slate-600">
                <span>MTTR {formatMTTR(item.mttr)}</span>
                <span className="tabular-nums font-medium text-slate-400">{item.count}</span>
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
              <div
                className={`h-full rounded-full ${COLORS[i % COLORS.length]} opacity-70`}
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
