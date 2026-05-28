'use client';

import { useState } from 'react';
import { Ticket, Country, TicketStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  cn, formatDate, getStatusColor, getPriorityColor,
  getStatusLabel, getPriorityLabel, getCountryLabel,
} from '@/lib/utils';

interface TicketDetailProps {
  ticket: Ticket;
  onAskCopilot: (query: string, country: Country) => void;
  onEscalate: (ticketId: string, reason: string) => void;
  copilotLoading: boolean;
}

export function TicketDetail({ ticket, onAskCopilot, onEscalate, copilotLoading }: TicketDetailProps) {
  const [query, setQuery] = useState('');
  const [escalating, setEscalating] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');
  const [escalated, setEscalated] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    onAskCopilot(query.trim(), ticket.country);
    setQuery('');
  }

  function handleConfirmEscalate() {
    if (!escalationReason.trim()) return;
    onEscalate(ticket.id, escalationReason.trim());
    setEscalated(true);
    setEscalating(false);
    setEscalationReason('');
  }

  const quickPrompts = [
    `¿Cuál es la regulación aplicable para este caso en ${getCountryLabel(ticket.country)}?`,
    `¿Cómo se calcula correctamente y cuáles son los pasos a seguir?`,
    `¿Existen casos similares resueltos anteriormente?`,
  ];

  const alreadyEscalated = ticket.status === 'escalated' || escalated;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-6 py-4">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-mono text-xs text-slate-600">{ticket.id}</span>
              <Badge className={cn('text-[10px]', getStatusColor(alreadyEscalated ? 'escalated' : ticket.status))}>
                {getStatusLabel(alreadyEscalated ? 'escalated' : ticket.status)}
              </Badge>
              <Badge className={cn('text-[10px]', getPriorityColor(ticket.priority))}>
                {getPriorityLabel(ticket.priority)}
              </Badge>
            </div>
            <h1 className="text-base font-semibold text-slate-100 leading-snug">
              {ticket.title}
            </h1>
          </div>

          {alreadyEscalated ? (
            <span className="shrink-0 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-400">
              Escalado
            </span>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="shrink-0"
              onClick={() => setEscalating(v => !v)}
            >
              {escalating ? 'Cancelar' : 'Escalar'}
            </Button>
          )}
        </div>

        {/* Escalation form */}
        {escalating && (
          <div className="mb-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="mb-2 text-xs font-semibold text-amber-400">Motivo del escalamiento</p>
            <textarea
              value={escalationReason}
              onChange={e => setEscalationReason(e.target.value)}
              placeholder="Describe por qué este ticket requiere atención de un agente senior…"
              rows={2}
              className="mb-2 w-full resize-none rounded-md border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEscalating(false)}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={!escalationReason.trim()}
                onClick={handleConfirmEscalate}
              >
                Confirmar escalamiento
              </Button>
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          <span><span className="text-slate-600">Agente:</span>{' '}<span className="text-slate-400">{ticket.agent}</span></span>
          <span><span className="text-slate-600">País:</span>{' '}<span className="text-slate-400">{getCountryLabel(ticket.country)}</span></span>
          <span><span className="text-slate-600">Categoría:</span>{' '}<span className="text-slate-400">{ticket.category}</span></span>
          <span><span className="text-slate-600">Creado:</span>{' '}<span className="text-slate-400">{formatDate(ticket.createdAt)}</span></span>
          {ticket.mttr && (
            <span><span className="text-slate-600">MTTR:</span>{' '}<span className="text-slate-400">{Math.round(ticket.mttr / 60)}h</span></span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="mb-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
            Descripción del Ticket
          </h3>
          <p className="text-sm leading-relaxed text-slate-300">{ticket.description}</p>
        </div>

        <div className="mb-6 border-t border-white/[0.06]" />

        {/* Quick asks */}
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
            Consultas Sugeridas al Copiloto
          </h3>
          <div className="space-y-2">
            {quickPrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => onAskCopilot(prompt, ticket.country)}
                disabled={copilotLoading}
                className="group flex w-full items-start gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-left text-sm text-slate-400 transition-all hover:border-indigo-500/30 hover:bg-indigo-500/5 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 size-3.5 shrink-0 text-indigo-500 group-hover:text-indigo-400">
                  <path fillRule="evenodd" d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L8 11.345l-3.136 2.649a.75.75 0 0 1-1.12-.814l.853-3.575-2.79-2.39a.75.75 0 0 1 .427-1.317l3.663-.293L7.308 2.212A.75.75 0 0 1 8 1.75Z" clipRule="evenodd" />
                </svg>
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Query input */}
      <div className="border-t border-white/[0.06] px-6 py-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Pregunta al copiloto sobre este ticket…"
            disabled={copilotLoading}
            className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 disabled:opacity-40"
          />
          <Button type="submit" loading={copilotLoading} disabled={!query.trim()}>
            Consultar
          </Button>
        </form>
      </div>
    </div>
  );
}
