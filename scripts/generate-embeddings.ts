/**
 * Generación masiva de embeddings para tickets_historicos_v2
 *
 * Uso:
 *   npx tsx scripts/generate-embeddings.ts
 *
 * Variables de entorno requeridas (en .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   OPENAI_API_KEY
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const EMBEDDING_MODEL = 'text-embedding-3-small';
const BATCH_SIZE = 10; // tickets por lote (respeta rate limits OpenAI)
const DELAY_MS = 500; // pausa entre lotes

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildTextForEmbedding(ticket: Record<string, unknown>): string {
  return [
    `Título: ${ticket.titulo}`,
    `Categoría: ${ticket.categoria}`,
    `País: ${ticket.pais}`,
    `Descripción: ${ticket.descripcion}`,
    ticket.resolucion ? `Resolución: ${ticket.resolucion}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

async function generateEmbeddings() {
  console.log('🚀 Iniciando generación de embeddings...\n');

  // Fetch tickets sin embedding
  const { data: tickets, error } = await supabase
    .from('tickets_historicos_v2')
    .select('id, titulo, descripcion, categoria, pais, resolucion')
    .is('embedding', null);

  if (error) {
    console.error('❌ Error al leer tickets:', error.message);
    process.exit(1);
  }

  if (!tickets || tickets.length === 0) {
    console.log('✅ Todos los tickets ya tienen embeddings.');
    return;
  }

  console.log(`📋 ${tickets.length} tickets sin embedding encontrados.\n`);

  let processed = 0;
  let failed = 0;

  for (let i = 0; i < tickets.length; i += BATCH_SIZE) {
    const batch = tickets.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(tickets.length / BATCH_SIZE);

    process.stdout.write(`Lote ${batchNum}/${totalBatches} — ${batch.length} tickets... `);

    try {
      const texts = batch.map(buildTextForEmbedding);

      const embeddingRes = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: texts,
      });

      // Update each ticket with its embedding
      const updates = batch.map((ticket, idx) => ({
        id: ticket.id,
        embedding: embeddingRes.data[idx].embedding,
      }));

      for (const update of updates) {
        const { error: upsertError } = await supabase
          .from('tickets_historicos_v2')
          .update({ embedding: update.embedding })
          .eq('id', update.id);

        if (upsertError) {
          console.error(`\n  ⚠️  Error en ticket ${update.id}: ${upsertError.message}`);
          failed++;
        } else {
          processed++;
        }
      }

      const usage = embeddingRes.usage;
      console.log(`✅ (${usage.total_tokens} tokens)`);
    } catch (err) {
      console.error(`\n  ❌ Error en lote: ${err instanceof Error ? err.message : err}`);
      failed += batch.length;
    }

    if (i + BATCH_SIZE < tickets.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log('\n─────────────────────────────');
  console.log(`✅ Procesados: ${processed}`);
  if (failed > 0) console.log(`❌ Fallidos:   ${failed}`);
  console.log('─────────────────────────────');
  console.log('\nEmbeddings generados. El RAG ya puede buscar por similitud semántica.\n');
}

generateEmbeddings().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
