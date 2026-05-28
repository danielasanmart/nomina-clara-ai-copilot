import { KnowledgeGap } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ConfidenceMeter } from '@/components/ui/ConfidenceMeter';
import { cn } from '@/lib/utils';

const impactColor: Record<string, string> = {
  high: 'text-red-400 bg-red-500/10',
  medium: 'text-amber-400 bg-amber-500/10',
  low: 'text-slate-400 bg-slate-500/10',
};
const impactLabel: Record<string, string> = { high: 'Alto', medium: 'Medio', low: 'Bajo' };

interface KnowledgeGapsProps {
  gaps: KnowledgeGap[];
}

export function KnowledgeGaps({ gaps }: KnowledgeGapsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gaps de Conocimiento</CardTitle>
        <Badge className="text-[10px] text-amber-400 bg-amber-500/10">{gaps.length} identificados</Badge>
      </CardHeader>
      <div className="space-y-4">
        {gaps.map(gap => (
          <div key={gap.topic} className="space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-slate-300 leading-snug">{gap.topic}</p>
              <Badge className={cn('shrink-0 text-[10px]', impactColor[gap.impact])}>
                {impactLabel[gap.impact]}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <ConfidenceMeter value={gap.avgConfidence} size="sm" />
              <span className="whitespace-nowrap text-[11px] text-slate-600">
                {gap.ticketCount} tickets
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
