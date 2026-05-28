// ─── NóminaClara · Code node v2 — confianza real ─────────────────────────────
// Parsea el score CONFIDENCE:0.X que el AI Agent incluye en su respuesta
// y lo separa del texto visible para el agente.
// ─────────────────────────────────────────────────────────────────────────────

const safeStr = (val) =>
  val !== undefined && val !== null && val !== '' ? String(val) : null;

function parseConfidence(text) {
  // Busca la línea "CONFIDENCE:0.X" en cualquier parte del texto
  const match = text.match(/CONFIDENCE:(0\.\d+|1\.0|1|0)/i);
  if (!match) return null;
  const val = parseFloat(match[1]);
  return isNaN(val) ? null : Math.min(1, Math.max(0, val));
}

function cleanAnswer(text) {
  // Elimina la línea CONFIDENCE del texto que ve el agente
  return text
    .replace(/\n?CONFIDENCE:(0\.\d+|1\.0|1|0)\n?/gi, '')
    .trim();
}

try {
  const raw = items[0]?.json ?? {};

  // Detectar error de Continue On Fail
  if (raw.error) {
    return [{
      json: {
        output:            `El asistente encontró un problema técnico. Intenta de nuevo.\n\nDetalle: ${raw.error}`,
        confidence:        0.1,
        reasoning:         `Error del AI Agent: ${raw.error}`,
        similar_cases:     [],
        legal_references:  [],
        should_escalate:   true,
        escalation_reason: 'Error interno del AI Agent',
        processing_time:   Date.now(),
        _debug:            { error: raw.error, raw_keys: Object.keys(raw) }
      }
    }];
  }

  // Obtener texto del AI Agent
  const rawAnswer = safeStr(raw.output)
    ?? safeStr(raw.text)
    ?? safeStr(raw.response)
    ?? safeStr(raw.message)
    ?? safeStr(raw.content);

  if (!rawAnswer) {
    return [{
      json: {
        output:            'El agente no generó respuesta. Posible problema con el prompt o el modelo.',
        confidence:        0.1,
        reasoning:         'Output vacío del AI Agent',
        similar_cases:     [],
        legal_references:  [],
        should_escalate:   true,
        escalation_reason: 'AI Agent completó sin generar texto',
        processing_time:   Date.now(),
        _debug:            { raw_keys: Object.keys(raw) }
      }
    }];
  }

  // Parsear confianza real del texto
  const parsedConfidence = parseConfidence(rawAnswer);
  const confidence = parsedConfidence !== null
    ? parsedConfidence
    : 0.78; // fallback si el AI Agent no incluyó el score

  // Limpiar el texto (quitar la línea CONFIDENCE)
  const answer = cleanAnswer(rawAnswer);

  return [{
    json: {
      output:            answer,
      confidence:        confidence,
      confidence_source: parsedConfidence !== null ? 'ai_agent' : 'default',
      reasoning:         safeStr(raw.reasoning) ?? '',
      similar_cases:     Array.isArray(raw.similar_cases)    ? raw.similar_cases    : [],
      legal_references:  Array.isArray(raw.legal_references) ? raw.legal_references : [],
      should_escalate:   confidence < 0.4 ? true : (raw.should_escalate === true),
      escalation_reason: confidence < 0.4
        ? 'Confianza baja — la base de conocimiento no tiene información suficiente sobre esta consulta'
        : (safeStr(raw.escalation_reason) ?? null),
      processing_time:   Date.now(),
    }
  }];

} catch (err) {
  return [{
    json: {
      output:            'Error inesperado en el procesamiento. Por favor intenta de nuevo.',
      confidence:        0.1,
      reasoning:         String(err.message),
      similar_cases:     [],
      legal_references:  [],
      should_escalate:   true,
      escalation_reason: `Excepción en Code node: ${err.message}`,
      processing_time:   Date.now(),
    }
  }];
}
