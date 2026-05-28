'use client';

import { useState } from 'react';
import { Ticket, Country, FeedbackType } from '@/types';
import { mockTickets } from '@/data/mockTickets';
import { useCopilot } from '@/hooks/useCopilot';
import { TicketList } from '@/components/agent/TicketList';
import { TicketDetail } from '@/components/agent/TicketDetail';
import { CopilotPanel } from '@/components/agent/CopilotPanel';

export default function AgentPage() {
  const [tickets, setTickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(mockTickets[0]);
  const [lastQuery, setLastQuery] = useState('');
  const { response, loading, error, feedbackSent, query, sendFeedback, reset } = useCopilot();

  function handleAskCopilot(q: string, country: Country) {
    if (!selectedTicket) return;
    setLastQuery(q);
    query({ query: q, ticketId: selectedTicket.id, country, category: selectedTicket.category });
  }

  function handleSelectTicket(ticket: Ticket) {
    setSelectedTicket(ticket);
    setLastQuery('');
    reset();
  }

  function handleFeedback(type: FeedbackType) {
    if (!selectedTicket || !response) return;
    sendFeedback({ ticketId: selectedTicket.id, responseId: `${selectedTicket.id}-${Date.now()}`, type });
  }

  function handleEscalate(ticketId: string, _reason: string) {
    setTickets(prev =>
      prev.map(t => t.id === ticketId ? { ...t, status: 'escalated' as const } : t)
    );
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, status: 'escalated' } : prev);
    }
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="w-72 shrink-0 border-r border-white/[0.06] overflow-hidden">
        <TicketList
          tickets={tickets}
          selectedId={selectedTicket?.id ?? null}
          onSelect={handleSelectTicket}
        />
      </div>

      <div className="flex-1 border-r border-white/[0.06] overflow-hidden">
        {selectedTicket ? (
          <TicketDetail
            ticket={selectedTicket}
            onAskCopilot={handleAskCopilot}
            onEscalate={handleEscalate}
            copilotLoading={loading}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-600">Selecciona un ticket para comenzar</p>
          </div>
        )}
      </div>

      <div className="w-80 shrink-0 overflow-hidden">
        <CopilotPanel
          response={response}
          loading={loading}
          error={error}
          feedbackSent={feedbackSent}
          onFeedback={handleFeedback}
          onReset={() => { reset(); setLastQuery(''); }}
          ticketId={selectedTicket?.id}
          country={selectedTicket?.country}
          category={selectedTicket?.category}
          lastQuery={lastQuery}
        />
      </div>
    </div>
  );
}
