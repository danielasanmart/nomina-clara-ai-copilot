import { mockDashboardMetrics } from '@/data/mockTickets';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { VolumeChart } from '@/components/dashboard/VolumeChart';
import { KnowledgeGaps } from '@/components/dashboard/KnowledgeGaps';
import { RepetitivePatterns } from '@/components/dashboard/RepetitivePatterns';
import { AgentTable } from '@/components/dashboard/AgentTable';
import { formatMTTR, formatConfidence } from '@/lib/utils';

const m = mockDashboardMetrics;

export default function DashboardPage() {
  const resolutionRate = Math.round((m.resolvedTickets / m.totalTickets) * 100);
  const escalationRate = Math.round((m.escalatedTickets / m.totalTickets) * 100);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-100">Dashboard Gerencial</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              NóminaClara · Colombia & México · Mayo 2026
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-slate-500">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sistema operativo
          </div>
        </div>

        {/* KPIs row */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            label="MTTR Promedio"
            value={formatMTTR(m.mttrAvg)}
            trend={Math.abs(m.mttrTrend)}
            trendPositiveIsGood={false}
            trendLabel="reducción vs mes anterior"
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
              </svg>
            }
          />
          <MetricCard
            label="Tickets Totales"
            value={m.totalTickets.toLocaleString()}
            subvalue={`${m.resolvedTickets} resueltos · ${m.escalatedTickets} escalados`}
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path d="M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Z" />
                <path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 0 1-1.99 1.79H4.802a2 2 0 0 1-1.99-1.79L2 7.5Zm5.22 1.72a.75.75 0 0 1 1.06 0L10 10.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L11.06 12l1.72 1.72a.75.75 0 1 1-1.06 1.06L10 13.06l-1.72 1.72a.75.75 0 0 1-1.06-1.06L8.94 12l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            }
          />
          <MetricCard
            label="Tasa de Resolución"
            value={`${resolutionRate}%`}
            trend={4}
            trendLabel="vs mes anterior"
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
              </svg>
            }
          />
          <MetricCard
            label="Confianza IA Promedio"
            value={formatConfidence(m.aiConfidenceAvg)}
            trend={6}
            trendLabel="mejora modelo"
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path d="M10 2a6 6 0 0 1 6 6v3.586l.707.707A1 1 0 0 1 16 14h-1v1a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-1H4a1 1 0 0 1-.707-1.707L4 11.586V8a6 6 0 0 1 6-6Z" />
              </svg>
            }
          />
        </div>

        {/* Second row */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <VolumeChart data={m.dailyVolume} />
          </div>
          <CategoryChart data={m.topCategories} />
        </div>

        {/* Third row */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RepetitivePatterns patterns={m.repetitivePatterns} />
          <KnowledgeGaps gaps={m.knowledgeGaps} />
        </div>

        {/* Agent performance */}
        <AgentTable agents={m.agentPerformance} />
      </div>
    </div>
  );
}
