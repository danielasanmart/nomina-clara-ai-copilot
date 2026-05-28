import { WebhookRequest, AIResponse, WebhookResponse } from '@/types';

const TIMEOUT = 30000;

export async function callCopilotWebhook(payload: WebhookRequest): Promise<AIResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    // Routes through /api/copilot to keep the n8n webhook URL server-side only
    const res = await fetch('/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? `Error ${res.status}`);
    }

    const raw: WebhookResponse = await res.json();
    return normalize(raw);
  } finally {
    clearTimeout(timeout);
  }
}

function normalize(raw: WebhookResponse): AIResponse {
  return {
    answer: raw.output ?? raw.answer ?? 'Sin respuesta del copiloto.',
    confidence: raw.confidence ?? 0.75,
    reasoning: raw.reasoning ?? '',
    similarCases: raw.similar_cases ?? [],
    legalReferences: raw.legal_references ?? [],
    shouldEscalate: raw.should_escalate ?? false,
    escalationReason: raw.escalation_reason,
    processingTime: raw.processing_time ?? 0,
  };
}
