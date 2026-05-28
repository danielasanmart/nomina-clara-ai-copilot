import { AgentPerformance } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { ConfidenceMeter } from '@/components/ui/ConfidenceMeter';
import { formatMTTR } from '@/lib/utils';

interface AgentTableProps {
  agents: AgentPerformance[];
}

export function AgentTable({ agents }: AgentTableProps) {
  return (
    <Card padding="none">
      <div className="border-b border-white/[0.06] px-5 py-4">
        <CardTitle>Performance de Agentes</CardTitle>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {['Agente', 'Resueltos', 'MTTR', 'Escalación', 'Uso IA'].map(h => (
                <th
                  key={h}
                  className="px-5 py-3 text-left font-medium text-slate-600 first:font-semibold first:text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, i) => (
              <tr
                key={agent.name}
                className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-semibold text-white">
                      {agent.name.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-300">{agent.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 tabular-nums text-slate-400">{agent.ticketsResolved}</td>
                <td className="px-5 py-3 tabular-nums text-slate-400">{formatMTTR(agent.mttr)}</td>
                <td className="px-5 py-3 tabular-nums text-slate-400">
                  {(agent.escalationRate * 100).toFixed(0)}%
                </td>
                <td className="px-5 py-3 w-28">
                  <ConfidenceMeter value={agent.aiUsageRate} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
