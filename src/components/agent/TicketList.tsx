'use client';

import { useState, useMemo } from 'react';
import { Ticket, TicketStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { cn, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';

interface TicketListProps {
  tickets: Ticket[];
  selectedId: string | null;
  onSelect: (ticket: Ticket) => void;
}

const priorityDot: Record<string, string> = {
  low: 'bg-slate-500',
  medium: 'bg-blue-500',
  high: 'bg-amber-500',
  critical: 'bg-red-500',
};

type FilterKey = 'all' | TicketStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',         label: 'Todos' },
  { key: 'open',        label: 'Abiertos' },
  { key: 'in_progress', label: 'En Progreso' },
  { key: 'escalated',   label: 'Escalados' },
];

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-indigo-500/30 text-indigo-200 rounded-sm px-0.5">{part}</mark>
      : part
  );
}

export function TicketList({ tickets, selectedId, onSelect }: TicketListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = activeFilter === 'all' ? tickets : tickets.filter(t => t.status === activeFilter);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(t =>
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.agent.toLowerCase().includes(q)
      );
    }

    return result;
  }, [tickets, activeFilter, search]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">Tickets</h2>
          <p className="text-xs text-slate-500">
            {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
          </p>
        </div>
        <button className="flex size-7 items-center justify-center rounded-md text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-colors">
          <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
            <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="border-b border-white/[0.06] px-4 py-2.5">
        <div className="relative">
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-600 pointer-events-none"
          >
            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por ID, título, categoría…"
            className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] py-1.5 pl-8 pr-3 text-xs text-slate-300 placeholder-slate-600 outline-none transition-all focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="size-3">
                <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-white/[0.06] px-4 py-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={cn(
              'whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
              activeFilter === f.key
                ? 'bg-indigo-600/20 text-indigo-400'
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-8 text-slate-700 mb-3">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-slate-600">Sin resultados</p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-2 text-xs text-indigo-500 hover:text-indigo-400 transition-colors"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          filtered.map(ticket => (
            <button
              key={ticket.id}
              onClick={() => onSelect(ticket)}
              className={cn(
                'w-full border-b border-white/[0.04] px-4 py-3.5 text-left transition-colors duration-100',
                selectedId === ticket.id
                  ? 'bg-indigo-600/10 border-l-2 border-l-indigo-500'
                  : 'hover:bg-white/[0.03]',
              )}
            >
              <div className="mb-1.5 flex items-start gap-2">
                <span className={cn('mt-1 size-1.5 shrink-0 rounded-full', priorityDot[ticket.priority])} />
                <span className="line-clamp-2 text-sm font-medium text-slate-200 leading-snug">
                  {highlight(ticket.title, search)}
                </span>
              </div>
              <div className="ml-3.5 flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[10px] text-slate-600">
                  {highlight(ticket.id, search)}
                </span>
                <Badge className={cn('text-[10px]', getStatusColor(ticket.status))}>
                  {getStatusLabel(ticket.status)}
                </Badge>
                <Badge className="text-[10px] text-slate-500 bg-slate-500/10">
                  {ticket.country}
                </Badge>
              </div>
              <p className="ml-3.5 mt-1.5 text-[11px] text-slate-600">
                {formatDate(ticket.createdAt)} · {ticket.agent}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
