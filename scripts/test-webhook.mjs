/**
 * Test de conectividad end-to-end con el webhook de n8n
 * Uso: node scripts/test-webhook.mjs
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Leer .env.local manualmente
const envPath = resolve(process.cwd(), '.env.local');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => l.split('=').map(s => s.trim()))
    .map(([k, ...v]) => [k, v.join('=')])
);

const WEBHOOK_URL = env.N8N_WEBHOOK_URL;

if (!WEBHOOK_URL) {
  console.error('❌ N8N_WEBHOOK_URL no está en .env.local');
  process.exit(1);
}

console.log('🚀 Probando webhook:', WEBHOOK_URL);
console.log('⏳ Esperando respuesta (puede tardar 10-30s con AI Agent)...\n');

const start = Date.now();

try {
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: '¿Cómo se calcula la prima semestral para un empleado con contrato a término fijo que lleva 3 meses?',
      ticketId: 'TEST-001',
      country: 'CO',
      category: 'Prestaciones Sociales',
    }),
    signal: AbortSignal.timeout(60000),
  });

  const elapsed = Date.now() - start;
  const text = await res.text();

  console.log('─── Resultado ───────────────────────────────');
  console.log(`Status:  ${res.status} ${res.statusText}`);
  console.log(`Tiempo:  ${elapsed}ms`);
  console.log(`Tamaño:  ${text.length} bytes`);
  console.log('');

  if (!text) {
    console.log('⚠️  Cuerpo vacío.');
    console.log('');
    console.log('Acción: En n8n, abre el nodo Webhook y cambia');
    console.log('  "Respond" → "Using Respond to Webhook Node"');
    console.log('  Luego guarda y vuelve a probar.');
    process.exit(1);
  }

  try {
    const json = JSON.parse(text);
    console.log('✅ JSON válido recibido:');
    console.log(JSON.stringify(json, null, 2).slice(0, 1200));
    console.log('');

    // Validar campos que necesita el frontend
    const checks = [
      ['output / answer', !!(json.output || json.answer)],
      ['processing_time', !!json.processing_time],
      ['confidence', json.confidence !== undefined],
      ['similar_cases', Array.isArray(json.similar_cases)],
      ['legal_references', Array.isArray(json.legal_references)],
    ];

    console.log('─── Campos frontend ─────────────────────────');
    checks.forEach(([field, ok]) =>
      console.log(`  ${ok ? '✅' : '⚪'} ${field}${ok ? '' : ' (opcional — el frontend usa default)'}`)
    );

    const hasAnswer = checks[0][1];
    console.log('');
    console.log(hasAnswer
      ? '🎉 Webhook operativo. El frontend puede conectarse.'
      : '⚠️  El campo "output" o "answer" no está presente. Revisa el Respond to Webhook.'
    );
  } catch {
    console.log('⚠️  Respuesta no es JSON válido:');
    console.log(text.slice(0, 500));
  }
} catch (err) {
  console.error('❌ Error:', err.message);
}
