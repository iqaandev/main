'use client';

import { useMemo, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import Panel from './Panel';
import CopyButton from './CopyButton';
import { useDebouncedValue } from './useDebouncedValue';
import { JSON_TOKEN_CLASS, tokenizeJson } from '@/lib/tools/json-highlight';

type JwtStatus = 'valid' | 'expired' | 'not-yet-valid' | 'no-expiry';

interface DecodedJwt {
  header: unknown;
  payload: unknown;
  signature: string;
  status: JwtStatus;
  claims: { key: string; value: string; date?: string }[];
}

const CLAIM_LABELS: Record<string, string> = {
  sub: 'Subject',
  iss: 'Issuer',
  aud: 'Audience',
  exp: 'Expiry time',
  iat: 'Issued at',
  nbf: 'Not before',
  jti: 'JWT ID',
};

const STATUS_META: Record<JwtStatus, { label: string; className: string }> = {
  valid: {
    label: 'Valid',
    className: 'border-viridian/40 bg-viridian/10 text-viridian',
  },
  expired: {
    label: 'Expired',
    className: 'border-destructive/40 bg-destructive/10 text-destructive',
  },
  'not-yet-valid': {
    label: 'Not yet valid',
    className: 'border-destructive/40 bg-destructive/10 text-destructive',
  },
  'no-expiry': {
    label: 'No expiry',
    className: 'border-ink/20 bg-ink/5 text-ink/60',
  },
};

function decodeBase64Url(part: string): string {
  const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
}

function encodeBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function formatDateClaim(seconds: number): string {
  return new Date(seconds * 1000).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function makeSampleToken(): string {
  const now = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = encodeBase64Url(
    JSON.stringify({
      sub: 'user-1042',
      name: 'Amina Al-Rashid',
      iss: 'auth.iqaan.com',
      aud: 'api.iqaan.com',
      iat: now - 3600,
      nbf: now - 3600,
      exp: now + 86400,
      jti: 'f8a1c2d3-e4f5-6789-abcd-ef0123456789',
      scope: 'orders:read orders:write',
    })
  );
  // A dummy signature — decoding never verifies it, and that is the point.
  const signature = encodeBase64Url('not-a-real-signature-see-note-below');
  return `${header}.${payload}.${signature}`;
}

function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split('.');
  if (parts.length === 5) {
    throw new Error(
      'This looks like an encrypted JWE token (five parts). Its payload is ciphertext — there is nothing readable to decode without the key.'
    );
  }
  if (parts.length !== 3) {
    throw new Error(
      'A JWT has exactly three parts separated by dots — header.payload.signature.'
    );
  }

  let header: unknown;
  let payload: unknown;
  try {
    header = JSON.parse(decodeBase64Url(parts[0]));
    payload = JSON.parse(decodeBase64Url(parts[1]));
  } catch {
    throw new Error(
      'The header or payload is not valid Base64URL-encoded JSON. Check that the token was copied complete and unmodified.'
    );
  }

  const now = Date.now() / 1000;
  const record = (payload ?? {}) as Record<string, unknown>;
  const exp = typeof record.exp === 'number' ? record.exp : null;
  const nbf = typeof record.nbf === 'number' ? record.nbf : null;

  let status: JwtStatus;
  if (nbf !== null && now < nbf) status = 'not-yet-valid';
  else if (exp !== null) status = now >= exp ? 'expired' : 'valid';
  else status = 'no-expiry';

  const claims = Object.entries(record).map(([key, value]) => {
    const isNumericDate =
      typeof value === 'number' && (key === 'exp' || key === 'iat' || key === 'nbf');
    return {
      key,
      value:
        typeof value === 'object' && value !== null
          ? JSON.stringify(value)
          : String(value),
      date: isNumericDate ? formatDateClaim(value as number) : undefined,
    };
  });

  return { header, payload, signature: parts[2], status, claims };
}

function JsonBlock({ value }: { value: unknown }) {
  const tokens = useMemo(() => tokenizeJson(JSON.stringify(value, null, 2)), [value]);
  return (
    <pre className="overflow-auto font-mono text-[13px] leading-relaxed text-ink">
      <code>
        {tokens.map((token, i) => (
          <span key={i} className={JSON_TOKEN_CLASS[token.type]}>
            {token.text}
          </span>
        ))}
      </code>
    </pre>
  );
}

export default function JwtDecoder() {
  const [input, setInput] = useState('');
  const debounced = useDebouncedValue(input, 160);

  const decoded = useMemo(() => {
    if (debounced.trim() === '') return { state: 'empty' as const };
    try {
      return { state: 'ok' as const, value: decodeJwt(debounced) };
    } catch (error) {
      return {
        state: 'error' as const,
        message: error instanceof Error ? error.message : 'This token could not be decoded.',
      };
    }
  }, [debounced]);

  const meta = decoded.state === 'ok' ? STATUS_META[decoded.value.status] : null;

  return (
    <div className="space-y-5">
      <Panel
        label="Token"
        actions={
          <>
            <button
              type="button"
              onClick={() => setInput(makeSampleToken())}
              className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.15em] text-ink/45 transition-colors duration-300 hover:text-ink"
            >
              Load sample
            </button>
            <button
              type="button"
              onClick={() => setInput('')}
              className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.15em] text-ink/45 transition-colors duration-300 hover:text-ink"
            >
              Clear
            </button>
          </>
        }
        bodyClassName="p-0"
      >
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Paste a JWT (eyJhbGciOi…)…"
          aria-label="JWT input"
          spellCheck={false}
          className="min-h-[110px] resize-y rounded-none border-0 font-mono text-[13px] leading-relaxed shadow-none focus-visible:ring-0"
        />
      </Panel>

      {decoded.state === 'empty' && (
        <Panel label="Decoded token">
          <p className="py-10 text-center text-sm italic text-ink/40">
            Paste a token above — the header, payload, and signature appear here.
          </p>
        </Panel>
      )}

      {decoded.state === 'error' && (
        <Panel label="Decoded token">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-destructive">
            <span aria-hidden="true" className="inline-block h-[5px] w-[5px] rotate-45 bg-destructive" />
            Cannot decode
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">{decoded.message}</p>
        </Panel>
      )}

      {decoded.state === 'ok' && meta && (
        <>
          {/* Status */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-md border border-ink/10 bg-card px-5 py-4">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] ${meta.className}`}
            >
              <span aria-hidden="true" className="inline-block h-[5px] w-[5px] rotate-45 bg-current opacity-70" />
              {meta.label}
            </span>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/45">
              Decoding only — signatures aren&rsquo;t verified. Verification belongs
              server-side.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Panel
              label="Header"
              accent="bg-viridian"
              actions={<CopyButton value={() => JSON.stringify(decoded.value.header, null, 2)} />}
            >
              <JsonBlock value={decoded.value.header} />
            </Panel>

            <Panel
              label="Payload"
              accent="bg-gold"
              actions={<CopyButton value={() => JSON.stringify(decoded.value.payload, null, 2)} />}
            >
              <JsonBlock value={decoded.value.payload} />
            </Panel>

            <Panel
              label="Signature"
              accent="bg-ink/30"
              className="lg:col-span-2"
              actions={<CopyButton value={() => decoded.value.signature} />}
            >
              <p className="break-all font-mono text-[12px] leading-relaxed text-ink/50">
                {decoded.value.signature}
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-ink/45">
                The signature is a HMAC or digital signature over the header and
                payload. It cannot be checked without the issuer&rsquo;s secret or
                public key — always verify tokens server-side.
              </p>
            </Panel>
          </div>

          {/* Claims */}
          {decoded.value.claims.length > 0 && (
            <Panel label="Claims">
              <dl className="divide-y divide-ink/10">
                {decoded.value.claims.map((claim) => (
                  <div
                    key={claim.key}
                    className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[10rem_1fr]"
                  >
                    <dt className="font-mono text-[12px] text-viridian">
                      {claim.key}
                      {CLAIM_LABELS[claim.key] && (
                        <span className="ms-2 font-sans text-[11px] uppercase tracking-[0.12em] text-ink/40">
                          {CLAIM_LABELS[claim.key]}
                        </span>
                      )}
                    </dt>
                    <dd className="min-w-0 break-all font-mono text-[12px] leading-relaxed text-ink/75">
                      {claim.value}
                      {claim.date && (
                        <span className="ms-2 font-sans text-[12px] italic text-ink/45">
                          — {claim.date}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>
          )}
        </>
      )}
    </div>
  );
}
