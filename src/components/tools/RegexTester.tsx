'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Panel from './Panel';
import { useDebouncedValue } from './useDebouncedValue';

interface RegexMatch {
  index: number;
  text: string;
  groups: (string | undefined)[];
  named: Record<string, string | undefined>;
}

const FLAGS: { flag: string; hint: string }[] = [
  { flag: 'g', hint: 'global — all matches' },
  { flag: 'i', hint: 'ignore case' },
  { flag: 'm', hint: 'multiline — ^ and $ per line' },
  { flag: 's', hint: 'dotall — . matches newlines' },
  { flag: 'u', hint: 'unicode — full Unicode, \\p{…}' },
];

const CHEATSHEET: { token: string; meaning: string }[] = [
  { token: '\\d \\w \\s', meaning: 'digit, word character, whitespace' },
  { token: '.', meaning: 'any character (add s for newlines)' },
  { token: '+ * ?', meaning: 'one or more, zero or more, optional (lazy with ?)' },
  { token: '{n,m}', meaning: 'between n and m repetitions' },
  { token: '[abc] [^abc]', meaning: 'character class, negated class' },
  { token: '( … )', meaning: 'capturing group' },
  { token: '(?: … )', meaning: 'non-capturing group' },
  { token: '(?<name> … )', meaning: 'named capturing group' },
  { token: '^ $', meaning: 'start / end (of line with m)' },
  { token: '\\b', meaning: 'word boundary' },
  { token: 'x(?=y) x(?!y)', meaning: 'lookahead, negative lookahead' },
  { token: '(?<=y)x (?<!y)x', meaning: 'lookbehind, negative lookbehind' },
  { token: 'a|b', meaning: 'alternation — a or b' },
  { token: '\\p{L}', meaning: 'Unicode letter (needs u)' },
];

const SAMPLE_PATTERN = '[\\w.+-]+@[\\w-]+\\.[\\w.]+';
const SAMPLE_TEXT = `Contact us at hello@iqaan.com or support@iqaan.com.
Not an email: iqaan(at)example — but this one is: a.al-rashid+orders@mail.example.co.uk
Old address (deprecated): root@localhost`;

const MAX_MATCHES = 500;
const HIGHLIGHT_TEXT_CAP = 20000;

function findMatches(re: RegExp, text: string): RegexMatch[] {
  const matches: RegexMatch[] = [];
  if (re.global) {
    re.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
      matches.push({
        index: match.index,
        text: match[0],
        groups: match.slice(1),
        named: { ...match.groups },
      });
      if (match[0] === '') re.lastIndex++; // zero-length guard
      if (matches.length >= MAX_MATCHES) break;
    }
  } else {
    const match = re.exec(text);
    if (match) {
      matches.push({
        index: match.index,
        text: match[0],
        groups: match.slice(1),
        named: { ...match.groups },
      });
    }
  }
  return matches;
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState<Record<string, boolean>>({ g: true, i: false, m: false, s: false, u: false });
  const [text, setText] = useState('');
  const debouncedPattern = useDebouncedValue(pattern, 140);
  const debouncedText = useDebouncedValue(text, 140);

  const flagString = useMemo(
    () => FLAGS.filter((f) => flags[f.flag]).map((f) => f.flag).join(''),
    [flags]
  );

  const compiled = useMemo(() => {
    if (debouncedPattern === '') return { state: 'empty' as const };
    try {
      return { state: 'ok' as const, re: new RegExp(debouncedPattern, flagString) };
    } catch (error) {
      return {
        state: 'error' as const,
        message: error instanceof Error ? error.message : 'Invalid regular expression',
      };
    }
  }, [debouncedPattern, flagString]);

  const matches = useMemo(() => {
    if (compiled.state !== 'ok') return [];
    return findMatches(compiled.re, debouncedText);
  }, [compiled, debouncedText]);

  const groupCount = useMemo(() => {
    if (compiled.state !== 'ok') return 0;
    const counted = new RegExp(`${compiled.re.source}|`).exec('');
    return counted ? counted.length - 1 : 0;
  }, [compiled]);

  const highlighted = useMemo(() => {
    if (debouncedText === '' || matches.length === 0) return null;
    const source = debouncedText.slice(0, HIGHLIGHT_TEXT_CAP);
    const usable = matches.filter((m) => m.index < source.length);
    const parts: { text: string; match: boolean; alt: boolean }[] = [];
    let cursor = 0;
    usable.forEach((match, i) => {
      const end = match.index + match.text.length;
      if (match.index > cursor) parts.push({ text: source.slice(cursor, match.index), match: false, alt: false });
      parts.push({ text: source.slice(match.index, end), match: true, alt: i % 2 === 1 });
      cursor = Math.max(cursor, end);
    });
    if (cursor < source.length) parts.push({ text: source.slice(cursor), match: false, alt: false });
    return { parts, truncated: debouncedText.length > HIGHLIGHT_TEXT_CAP };
  }, [debouncedText, matches]);

  return (
    <div className="space-y-5">
      <Panel label="Pattern">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <Input
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            placeholder="Enter a regular expression…"
            aria-label="Regular expression pattern"
            spellCheck={false}
            aria-invalid={compiled.state === 'error' || undefined}
            className="h-11 flex-1 font-mono text-[13px]"
          />
          <div
            role="group"
            aria-label="Regex flags"
            className="flex flex-wrap items-center gap-2"
          >
            {FLAGS.map(({ flag, hint }) => (
              <button
                key={flag}
                type="button"
                title={hint}
                aria-label={`Flag ${flag} — ${hint}`}
                aria-pressed={flags[flag] ?? false}
                onClick={() => setFlags({ ...flags, [flag]: !flags[flag] })}
                className={`h-9 w-9 cursor-pointer rounded-md border font-mono text-[12px] transition-colors duration-300 ${
                  flags[flag]
                    ? 'border-viridian/50 bg-viridian/10 text-viridian'
                    : 'border-ink/15 text-ink/45 hover:border-ink/40 hover:text-ink'
                }`}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>
        {compiled.state === 'error' && (
          <p className="mt-3 text-[13px] leading-relaxed text-destructive">
            {compiled.message}
          </p>
        )}
      </Panel>

      <Panel
        label="Test text"
        actions={
          <>
            <button
              type="button"
              onClick={() => {
                setPattern(SAMPLE_PATTERN);
                setFlags({ g: true, i: true, m: false, s: false, u: false });
                setText(SAMPLE_TEXT);
              }}
              className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.15em] text-ink/45 transition-colors duration-300 hover:text-ink"
            >
              Load sample
            </button>
            <button
              type="button"
              onClick={() => setText('')}
              className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.15em] text-ink/45 transition-colors duration-300 hover:text-ink"
            >
              Clear
            </button>
          </>
        }
        bodyClassName="p-0"
      >
        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste the text to test against…"
          aria-label="Test text"
          spellCheck={false}
          className="min-h-[140px] resize-y rounded-none border-0 font-mono text-[13px] leading-relaxed shadow-none focus-visible:ring-0"
        />
      </Panel>

      <Panel
        label="Matches"
        actions={
          compiled.state === 'ok' ? (
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50">
              {matches.length}
              {matches.length >= MAX_MATCHES ? '+' : ''} match
              {matches.length === 1 ? '' : 'es'}
              {groupCount > 0 ? ` · ${groupCount} group${groupCount === 1 ? '' : 's'}` : ''}
            </span>
          ) : null
        }
      >
        {compiled.state === 'error' && (
          <p className="text-sm italic text-ink/40">
            Matches appear once the pattern compiles.
          </p>
        )}
        {compiled.state === 'empty' && (
          <p className="text-sm italic text-ink/40">
            Enter a pattern above — matches highlight here as you type.
          </p>
        )}
        {compiled.state === 'ok' && debouncedText === '' && (
          <p className="text-sm italic text-ink/40">
            Add test text to see matches.
          </p>
        )}
        {compiled.state === 'ok' && debouncedText !== '' && matches.length === 0 && (
          <p className="text-sm italic text-ink/40">
            No matches. Try flipping a flag — anchors like <span className="font-mono">^</span>{' '}
            and <span className="font-mono">.</span>{' '}behave differently with m and s.
          </p>
        )}
        {highlighted && (
          <>
            <pre className="max-h-[240px] overflow-auto whitespace-pre-wrap break-words font-mono text-[13px] leading-[1.9] text-ink/80">
              {highlighted.parts.map((part, i) =>
                part.match ? (
                  <span
                    key={i}
                    className={`rounded-[2px] underline decoration-2 underline-offset-4 ${
                      part.alt
                        ? 'bg-gold/25 decoration-gold'
                        : 'bg-viridian/15 decoration-viridian/70'
                    }`}
                  >
                    {part.text === '' ? '·' : part.text}
                  </span>
                ) : (
                  <span key={i}>{part.text}</span>
                )
              )}
            </pre>
            {highlighted.truncated && (
              <p className="mt-3 text-[12px] text-ink/45">
                Highlighting truncated after 20,000 characters — all matches are
                still counted and listed below.
              </p>
            )}
          </>
        )}
      </Panel>

      <Panel label="Capture groups">
        {matches.length === 0 || groupCount === 0 ? (
          <p className="text-sm italic text-ink/40">
            {matches.length === 0
              ? 'Group details appear when there is a match.'
              : 'This pattern has no capturing groups — wrap part of it in ( … ) to capture.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left font-mono text-[12px]">
              <thead>
                <tr className="border-b border-ink/15 text-[10px] uppercase tracking-[0.15em] text-ink/45">
                  <th scope="col" className="py-2.5 pr-4 font-normal">#</th>
                  <th scope="col" className="py-2.5 pr-4 font-normal">Match</th>
                  <th scope="col" className="py-2.5 pr-4 font-normal">Position</th>
                  <th scope="col" className="py-2.5 font-normal">Groups</th>
                </tr>
              </thead>
              <tbody>
                {matches.slice(0, 100).map((match, i) => (
                  <tr key={`${match.index}-${i}`} className="border-b border-ink/10 align-top last:border-0">
                    <td className="py-2.5 pr-4 text-ink/40">{i + 1}</td>
                    <td className="max-w-[220px] truncate py-2.5 pr-4 text-ink/85">{match.text}</td>
                    <td className="py-2.5 pr-4 text-ink/50">{match.index}</td>
                    <td className="py-2.5">
                      {match.groups.map((group, j) => (
                        <span key={j} className="mr-4 inline-block">
                          <span className="text-viridian">g{j + 1}:</span>{' '}
                          <span className="text-ink/70">{group === undefined ? '—' : `"${group}"`}</span>
                        </span>
                      ))}
                      {Object.entries(match.named).map(([name, value]) => (
                        <span key={name} className="mr-4 inline-block">
                          <span className="text-viridian">{name}:</span>{' '}
                          <span className="text-ink/70">{value === undefined ? '—' : `"${value}"`}</span>
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {matches.length > 100 && (
              <p className="mt-3 text-[12px] text-ink/45">
                Showing the first 100 matches of {matches.length}.
              </p>
            )}
          </div>
        )}
      </Panel>

      <Panel label="Cheatsheet" accent="bg-gold">
        <dl className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
          {CHEATSHEET.map((entry) => (
            <div key={entry.token} className="flex flex-col gap-0.5 border-t border-ink/10 pt-3 sm:border-0 sm:pt-0">
              <dt className="font-mono text-[12px] text-viridian">{entry.token}</dt>
              <dd className="text-[13px] leading-relaxed text-ink/60">{entry.meaning}</dd>
            </div>
          ))}
        </dl>
      </Panel>
    </div>
  );
}
