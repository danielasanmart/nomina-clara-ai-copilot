import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  try {
    const body = await req.json();
    const { ticketId, query, country, category, confidence, agentResponse } = body;

    if (!query?.trim()) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    const { error } = await supabase.from('knowledge_gaps').insert({
      ticket_id:      ticketId ?? null,
      query,
      country:        country ?? null,
      category:       category ?? null,
      confidence:     confidence ?? 0,
      agent_response: agentResponse ?? null,
      status:         'pending',
      created_at:     new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({ ok: true, message: 'Gap documentado correctamente' });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error al guardar gap' },
      { status: 500 },
    );
  }
}
