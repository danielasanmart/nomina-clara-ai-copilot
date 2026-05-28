import { TicketStatus, TicketPriority, Country } from '@/types';

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatMTTR(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function formatConfidence(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function getStatusLabel(status: TicketStatus): string {
  const map: Record<TicketStatus, string> = {
    open: 'Abierto',
    in_progress: 'En Progreso',
    resolved: 'Resuelto',
    escalated: 'Escalado',
  };
  return map[status];
}

export function getPriorityLabel(priority: TicketPriority): string {
  const map: Record<TicketPriority, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    critical: 'Crítica',
  };
  return map[priority];
}

export function getCountryLabel(country: Country): string {
  return country === 'CO' ? 'Colombia' : 'México';
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'text-emerald-400';
  if (confidence >= 0.6) return 'text-amber-400';
  return 'text-red-400';
}

export function getConfidenceBg(confidence: number): string {
  if (confidence >= 0.8) return 'bg-emerald-500/10 border-emerald-500/20';
  if (confidence >= 0.6) return 'bg-amber-500/10 border-amber-500/20';
  return 'bg-red-500/10 border-red-500/20';
}

export function getPriorityColor(priority: TicketPriority): string {
  const map: Record<TicketPriority, string> = {
    low: 'text-slate-400 bg-slate-500/10',
    medium: 'text-blue-400 bg-blue-500/10',
    high: 'text-amber-400 bg-amber-500/10',
    critical: 'text-red-400 bg-red-500/10',
  };
  return map[priority];
}

export function getStatusColor(status: TicketStatus): string {
  const map: Record<TicketStatus, string> = {
    open: 'text-blue-400 bg-blue-500/10',
    in_progress: 'text-amber-400 bg-amber-500/10',
    resolved: 'text-emerald-400 bg-emerald-500/10',
    escalated: 'text-red-400 bg-red-500/10',
  };
  return map[status];
}
