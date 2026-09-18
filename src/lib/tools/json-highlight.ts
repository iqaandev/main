/*
 * Hand-rolled JSON tokenizer + highlighter — no dependencies.
 * Walks the source once and emits spans a React tree can render,
 * with palette classes anchored to the site's paper/ink tokens.
 */

export type JsonTokenType = 'key' | 'string' | 'number' | 'literal' | 'punct';

export interface JsonToken {
  text: string;
  type: JsonTokenType;
}

/** Token palette — quiet, ink-safe colours on paper. */
export const JSON_TOKEN_CLASS: Record<JsonTokenType, string> = {
  key: 'text-viridian',
  string: 'text-[oklch(0.5_0.095_60)]',
  number: 'text-[oklch(0.42_0.08_255)]',
  literal: 'italic text-ink/55',
  punct: 'text-ink/35',
};

const LITERALS = new Set(['true', 'false', 'null']);

export function tokenizeJson(src: string): JsonToken[] {
  const tokens: JsonToken[] = [];
  let i = 0;

  while (i < src.length) {
    const char = src[i];

    // Whitespace — carried verbatim so formatting survives.
    if (/\s/.test(char)) {
      let j = i;
      while (j < src.length && /\s/.test(src[j])) j++;
      tokens.push({ text: src.slice(i, j), type: 'punct' });
      i = j;
      continue;
    }

    // Strings — a string is a "key" when the next non-space char is ':'.
    if (char === '"') {
      let j = i + 1;
      while (j < src.length && src[j] !== '"') {
        if (src[j] === '\\') j++; // skip escaped char
        j++;
      }
      const text = src.slice(i, Math.min(j + 1, src.length));
      let k = j + 1;
      while (k < src.length && /\s/.test(src[k])) k++;
      tokens.push({ text, type: src[k] === ':' ? 'key' : 'string' });
      i = j + 1;
      continue;
    }

    // Numbers (JSON grammar: -, digits, ., e/E, exponent signs)
    if (/[-0-9]/.test(char)) {
      let j = i;
      while (j < src.length && /[-0-9.eE+]/.test(src[j])) j++;
      tokens.push({ text: src.slice(i, j), type: 'number' });
      i = j;
      continue;
    }

    // Bare literals: true / false / null (anything alphabetic)
    if (/[a-zA-Z]/.test(char)) {
      let j = i;
      while (j < src.length && /[a-zA-Z]/.test(src[j])) j++;
      const word = src.slice(i, j);
      tokens.push({ text: word, type: LITERALS.has(word) ? 'literal' : 'punct' });
      i = j;
      continue;
    }

    // Punctuation: {} [ ] , :
    tokens.push({ text: char, type: 'punct' });
    i++;
  }

  return tokens;
}

export interface JsonErrorPosition {
  line: number;
  column: number;
  snippet: string;
}

/**
 * Turn a native JSON.parse error into a friendly line/column + snippet.
 * V8/Safari/SpiderMonkey all embed "position N" (or a caret context) —
 * we extract it, and fall back to a context-free message.
 */
export function locateJsonError(
  src: string,
  message: string
): { friendly: string } & Partial<JsonErrorPosition> {
  const match = message.match(/position\s+(\d+)/i);
  if (!match) {
    return { friendly: message.replace(/^JSON\.parse:\s*/, '') };
  }

  const pos = Math.min(Number(match[1]), src.length);
  let line = 1;
  let lineStart = 0;
  for (let i = 0; i < pos; i++) {
    if (src[i] === '\n') {
      line++;
      lineStart = i + 1;
    }
  }
  const column = pos - lineStart + 1;
  const lineEnd = src.indexOf('\n', lineStart);
  const source = src.slice(lineStart, lineEnd === -1 ? src.length : lineEnd);
  const window = 40;
  const from = Math.max(0, column - 1 - window);
  const to = Math.min(source.length, column - 1 + window);
  const snippet =
    (from > 0 ? '…' : '') +
    source.slice(from, to).trim() +
    (to < source.length ? '…' : '');

  return {
    friendly: `Invalid JSON at line ${line}, column ${column}`,
    line,
    column,
    snippet,
  };
}
