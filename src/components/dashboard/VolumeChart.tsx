import { DailyVolumeStat } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

interface VolumeChartProps {
  data: DailyVolumeStat[];
}

const DAY_LABELS: Record<number, string> = { 0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb' };

export function VolumeChart({ data }: VolumeChartProps) {
  const maxTickets = Math.max(...data.map(d => d.tickets), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volumen Diario — Última Semana</CardTitle>
        <div className="flex items-center gap-3 text-[10px] text-slate-600">
          <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-indigo-500/60" /> Total</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-emerald-500/60" /> Resueltos</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-red-500/60" /> Escalados</span>
        </div>
      </CardHeader>
      <div className="flex items-end gap-2 h-28">
        {data.map(day => {
          const d = new Date(day.date);
          const label = DAY_LABELS[d.getDay()];
          const ticketH = (day.tickets / maxTickets) * 100;
          const resolvedH = (day.resolved / maxTickets) * 100;
          return (
            <div key={day.date} className="group flex flex-1 flex-col items-center gap-1">
              <div className="relative flex w-full flex-col-reverse items-center justify-start gap-0.5">
                {/* Tickets bar */}
                <div
                  className="w-full rounded-t bg-indigo-500/25 transition-all"
                  style={{ height: `${ticketH}%`, minHeight: day.tickets > 0 ? 4 : 0 }}
                />
                {/* Resolved overlay */}
                <div
                  className="absolute bottom-0 w-full rounded-t bg-emerald-500/50 transition-all"
                  style={{ height: `${resolvedH}%`, minHeight: day.resolved > 0 ? 4 : 0 }}
                />
              </div>
              <span className="text-[10px] text-slate-600">{label}</span>
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 hidden rounded-md bg-slate-800 px-2 py-1 text-[10px] text-slate-300 shadow-xl group-hover:block whitespace-nowrap">
                {day.tickets} tickets · {day.resolved} resueltos · {day.escalated} escalados
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
