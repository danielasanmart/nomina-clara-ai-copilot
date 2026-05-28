import { NextRequest, NextResponse } from 'next/server';
import { WebhookRequest } from '@/types';

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL ?? '';
const WEBHOOK_TIMEOUT = 45000;

const errorResponse = (reason: string) =>
  NextResponse.json({
    output: 'El asistente no pudo procesar esta consulta. Por favor intenta de nuevo.',
    confidence: 0,
    reasoning: reason,
    similar_cases: [],
    legal_references: [],
    should_escalate: true,
    escalation_reason: reason,
    processing_time: 0,
  });

export async function POST(req: NextRequest) {
  try {
    const body: WebhookRequest = await req.json();

    if (!body.query?.trim()) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    if (!WEBHOOK_URL) {
      return errorResponse('Webhook no configurado — revisar N8N_WEBHOOK_URL en .env.local');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT);

    try {
      const upstream = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      // Leer el body siempre, aunque sea error
      const text = await upstream.text();

      if (!text) {
        return errorResponse(`n8n respondió sin contenido (status ${upstream.status})`);
      }

      let data: Record<string, unknown>;
      try {
        data = JSON.parse(text);
      } catch {
        return errorResponse(`Respuesta inválida de n8n: ${text.slice(0, 100)}`);
      }

      // Si n8n retornó error, convertirlo en respuesta estructurada (siempre 200)
      if (!upstream.ok) {
        const msg = (data.message as string) ?? `Error ${upstream.status} en el workflow`;
        return errorResponse(msg);
      }

      return NextResponse.json(data);
    } finally {
      clearTimeout(timeout);
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return errorResponse('Timeout: el asistente tardó más de 45s — intenta de nuevo');
    }
    return errorResponse(err instanceof Error ? err.message : 'Error interno');
  }
}
