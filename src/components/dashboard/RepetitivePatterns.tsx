import { RepetitivePattern } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface RepetitivePatternsProps {
  patterns: RepetitivePattern[];
}

export function RepetitivePatterns({ patterns }: RepetitivePatternsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets Repetitivos</CardTitle>
        <Badge className="text-[10px] text-indigo-400 bg-indigo-500/10">
          Oportunidad automatización
        </Badge>
      </CardHeader>
      <div className="space-y-3">
        {patterns.map(p => (
          <div
            key={p.pattern}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <p className="text-xs font-medium text-slate-300 leading-snug">{p.pattern}</p>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="tabular-nums text-xs font-semibold text-slate-200">{p.occurrences}</span>
                <span className="text-[11px] text-slate-600">casos</span>
              </div>
            </div>
            <Badge className="mb-2 text-[10px] text-slate-500 bg-slate-500/10">{p.category}</Badge>
            <div className="flex items-start gap-1.5">
              <svg viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 size-3 shrink-0 text-emerald-500">
                <path fillRule="evenodd" d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L8 11.345l-3.136 2.649a.75.75 0 0 1-1.12-.814l.853-3.575-2.79-2.39a.75.75 0 0 1 .427-1.317l3.663-.293L7.308 2.212A.75.75 0 0 1 8 1.75Z" clipRule="evenodd" />
              </svg>
              <p className="text-[11px] text-slate-500 leading-snug">{p.suggestedAction}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
