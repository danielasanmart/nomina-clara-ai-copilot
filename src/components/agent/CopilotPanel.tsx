'use client';

import { useState } from 'react';
import { AIResponse, FeedbackType } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfidenceMeter } from '@/components/ui/ConfidenceMeter';
import { SkeletonCopilotResponse } from '@/components/ui/Skeleton';
import { cn, getConfidenceBg } from '@/lib/utils';

interface CopilotPanelProps {
  response: AIResponse | null;
  loading: boolean;
  error: string | null;
  feedbackSent: FeedbackType | null;
  onFeedback: (type: FeedbackType) => void;
  onReset: () => void;
  ticketId?: string;
  country?: string;
  category?: string;
  lastQuery?: string;
}

export function CopilotPanel({
  response,
  loading,
  error,
  feedbackSent,
  onFeedback,
  onReset,
  ticketId,
  country,
  category,
  lastQuery,
}: CopilotPanelProps) {
  const [gapSaved, setGapSaved] = useState(false);
  const [gapSaving, setGapSaving] = useState(false);

  const isLowConfidence = response && response.confidence < 0.8;

  async function handleDocumentGap() {
    if (!response || gapSaved) return;
    setGapSaving(true);
    try {
      await fetch('/api/gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          query: lastQuery,
          country,
          category,
          confidence: response.confidence,
          agentResponse: response.answer,
        }),
      });
      setGapSaved(true);
    } catch {
      // silent — no bloquear UX
    } finally {
      setGapSaving(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
        <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-600/20">
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 text-indigo-400">
            <path d="M10 2a6 6 0 0 1 6 6v3.586l.707.707A1 1 0 0 1 16 14h-1v1a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-1H4a1 1 0 0 1-.707-1.707L4 11.586V8a6 6 0 0 1 6-6Z" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-200">AI Copiloto</h2>
          <p className="text-[11px] text-slate-600">NóminaClara · GPT-4o</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {response && (
            <Badge className="text-[10px] text-slate-500 bg-slate-500/10 border border-white/[0.06]">
              {response.processingTime}ms
            </Badge>
          )}
          {(response || error) && !loading && (
            <button
              onClick={() => { onReset(); setGapSaved(false); }}
              title="Nueva conversación"
              className="flex size-6 items-center justify-center rounded-md text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-colors"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
                <path fillRule="evenodd" d="M8 2.5a5.5 5.5 0 1 0 4.596 8.5H11a.75.75 0 0 1 0-1.5h3.25a.75.75 0 0 1 .75.75V13.5a.75.75 0 0 1-1.5 0v-1.616A7 7 0 1 1 8 1a.75.75 0 0 1 0 1.5Z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Empty state */}
        {!loading && !response && !error && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-indigo-600/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-6 text-indigo-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-400">Copiloto listo</p>
            <p className="mt-1 text-xs text-slate-600 max-w-[180px]">
              Selecciona un ticket y haz una consulta para recibir asistencia contextual
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
              <span className="size-3 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              Consultando base de conocimiento…
            </div>
            <SkeletonCopilotResponse />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <p className="mb-1 text-sm font-medium text-red-400">Error de conexión</p>
            <p className="text-xs text-red-500/70">{error}</p>
          </div>
        )}

        {/* Response */}
        {response && !loading && (
          <>
            {/* Confidence */}
            <Card className={cn('border', getConfidenceBg(response.confidence))}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Confianza de respuesta</span>
                {response.shouldEscalate && (
                  <Badge className="text-[10px] text-amber-400 bg-amber-500/10">
                    Escalar recomendado
                  </Badge>
                )}
              </div>
              <ConfidenceMeter value={response.confidence} />
            </Card>

            {/* ── GAP DE CONOCIMIENTO ── */}
            {isLowConfidence && (
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5 shrink-0 text-violet-400">
                    <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm9 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.92 6.085c.081-.16.19-.299.34-.398.145-.097.371-.187.74-.187.28 0 .553.087.738.225A.613.613 0 0 1 9 6.25c0 .177-.04.264-.077.318a.956.956 0 0 1-.277.245c-.076.051-.158.1-.258.161l-.007.004a7.728 7.728 0 0 0-.313.208 2.157 2.157 0 0 0-.482.555.75.75 0 0 0 1.29.756 .649.649 0 0 1 .132-.163 3.64 3.64 0 0 1 .24-.166l.003-.002.026-.016a6.398 6.398 0 0 0 .316-.21 2.41 2.41 0 0 0 .686-.74c.16-.275.241-.58.241-.917 0-.563-.224-1.066-.627-1.414C10.051 4.24 9.458 4 8.75 4c-.655 0-1.24.21-1.668.525a2.605 2.605 0 0 0-.849 1.001.75.75 0 1 0 1.367.616c.042-.084.086-.137.12-.163Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-violet-400">Gap de conocimiento detectado</span>
                </div>
                <p className="mb-3 text-[11px] text-violet-300/70 leading-relaxed">
                  La base de conocimiento no tiene información suficiente sobre esta consulta
                  (confianza {Math.round(response.confidence * 100)}%). Documéntala para que el equipo
                  pueda enriquecerla.
                </p>
                {gapSaved ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                    Gap documentado — aparecerá en el Dashboard de Knowledge Gaps
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    loading={gapSaving}
                    onClick={handleDocumentGap}
                    className="border-violet-500/20 text-violet-400 hover:bg-violet-500/10"
                  >
                    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
                      <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                    </svg>
                    Documentar gap de conocimiento
                  </Button>
                )}
              </div>
            )}

            {/* Answer */}
            <div>
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                Respuesta
              </h3>
              <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                {response.answer}
              </p>
            </div>

            {/* Reasoning */}
            {response.reasoning && (
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-2 text-xs text-slate-500 hover:text-slate-400">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="size-3 transition-transform group-open:rotate-90">
                    <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" />
                  </svg>
                  Ver razonamiento del modelo
                </summary>
                <div className="mt-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-xs leading-relaxed text-slate-500 whitespace-pre-wrap">{response.reasoning}</p>
                </div>
              </details>
            )}

            {/* Escalation alert */}
            {response.shouldEscalate && response.escalationReason && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="mb-1.5 flex items-center gap-2">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5 text-amber-400">
                    <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-amber-400">Escalamiento sugerido</span>
                </div>
                <p className="text-xs text-amber-500/70">{response.escalationReason}</p>
              </div>
            )}

            {/* Similar cases */}
            {response.similarCases.length > 0 && (
              <div>
                <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-600">Casos Similares</h3>
                <div className="space-y-2">
                  {response.similarCases.map(c => (
                    <div key={c.id} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-slate-300 leading-snug">{c.title}</p>
                        <Badge className="shrink-0 text-[10px] text-emerald-400 bg-emerald-500/10">
                          {Math.round(c.similarity * 100)}%
                        </Badge>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-500 line-clamp-2">{c.resolution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legal references */}
            {response.legalReferences.length > 0 && (
              <div>
                <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-600">Referencias Legales</h3>
                <div className="space-y-2">
                  {response.legalReferences.map((ref, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-indigo-600/20 text-[9px] font-bold text-indigo-400">
                        {ref.country}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-300">{ref.source} — {ref.article}</p>
                        <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">{ref.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback */}
            <div className="border-t border-white/[0.06] pt-4">
              <p className="mb-2.5 text-xs text-slate-600">¿Fue útil esta respuesta?</p>
              {feedbackSent ? (
                <p className="text-xs text-emerald-400">
                  ✓ Gracias por tu feedback — {feedbackSent === 'helpful' ? 'positivo' : 'negativo'}
                </p>
              ) : (
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => onFeedback('helpful')}>
                    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
                      <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046Z" />
                    </svg>
                    Útil
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onFeedback('not_helpful')}>
                    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5 rotate-180">
                      <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046Z" />
                    </svg>
                    No útil
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
