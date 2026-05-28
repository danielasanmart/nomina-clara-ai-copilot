import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { FeedbackPayload } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
);

export async function POST(req: NextRequest) {
  try {
    const body: FeedbackPayload = await req.json();

    if (!body.ticketId || !body.type) {
      return NextResponse.json({ error: 'ticketId and type are required' }, { status: 400 });
    }

    const { error } = await supabase.from('ai_feedback').insert({
      ticket_id: body.ticketId,
      response_id: body.responseId,
      feedback_type: body.type,
      comment: body.comment ?? null,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 },
    );
  }
}
