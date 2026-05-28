'use client';

import { useState, useCallback } from 'react';
import { AIResponse, WebhookRequest, FeedbackPayload, FeedbackType } from '@/types';
import { callCopilotWebhook } from '@/lib/webhook';

interface CopilotState {
  response: AIResponse | null;
  loading: boolean;
  error: string | null;
  feedbackSent: FeedbackType | null;
}

export function useCopilot() {
  const [state, setState] = useState<CopilotState>({
    response: null,
    loading: false,
    error: null,
    feedbackSent: null,
  });

  const query = useCallback(async (payload: WebhookRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null, feedbackSent: null }));
    try {
      const response = await callCopilotWebhook(payload);
      setState({ response, loading: false, error: null, feedbackSent: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al conectar con el copiloto';
      setState(prev => ({ ...prev, loading: false, error: message }));
    }
  }, []);

  const sendFeedback = useCallback(async (payload: FeedbackPayload) => {
    setState(prev => ({ ...prev, feedbackSent: payload.type }));
    // Fire-and-forget to Supabase / n8n feedback endpoint
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // Feedback errors are non-blocking
    }
  }, []);

  const reset = useCallback(() => {
    setState({ response: null, loading: false, error: null, feedbackSent: null });
  }, []);

  return { ...state, query, sendFeedback, reset };
}
