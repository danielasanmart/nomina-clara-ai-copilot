import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(url, anon);

export type Database = {
  public: {
    Tables: {
      tickets_historicos_v2: {
        Row: {
          id: string;
          titulo: string;
          descripcion: string;
          categoria: string;
          pais: string;
          resolucion: string;
          embedding: number[] | null;
          created_at: string;
          metadata: Record<string, unknown> | null;
        };
      };
      ai_feedback: {
        Row: {
          id: string;
          ticket_id: string;
          response_id: string;
          feedback_type: 'helpful' | 'not_helpful';
          comment: string | null;
          created_at: string;
        };
      };
    };
  };
};
