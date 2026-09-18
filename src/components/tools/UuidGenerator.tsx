'use client';

import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Panel from './Panel';
import CopyButton from './CopyButton';
import Segmented from './Segmented';

function stampNow(): string {
  return (
    new Date().toLocaleTimeString('en', { hour12: false }) +
    '.' +
    String(Date.now() % 1000).padStart(3, '0')
  );
}

function formatUuid(bytes: Uint8Array): string {
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** RFC 4122 version 4 — 122 cryptographically random bits. */
function uuidV4(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = 0x40 | (bytes[6] & 0x0f); // version 4
  bytes[8] = 0x80 | (bytes[8] & 0x3f); // variant 10
  return formatUuid(bytes);
}

/**
 * RFC 9562 version 7 — 48-bit big-endian unix millisecond timestamp,
 * then 12 random bits (rand_a) and 62 random bits (rand_b). Sortable.
 */
function uuidV7(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const timestamp = BigInt(Date.now());
  for (let i = 0; i < 6; i++) {
    bytes[i] = Number((timestamp >> BigInt(8 * (5 - i))) & 0xffn);
  }
  bytes[6] = 0x70 | (bytes[6] & 0x0f); // version 7
  bytes[8] = 0x80 | (bytes[8] & 0x3f); // variant 10
  return formatUuid(bytes);
}

function renderList(uuids: string[], uppercase: boolean, hyphens: boolean): string {
  return uuids
    .map((uuid) => {
      let value = hyphens ? uuid : uuid.replace(/-/g, '');
      if (uppercase) value = value.toUpperCase();
      return value;
    })
    .join('\n');
}

export default function UuidGenerator() {
  const [version, setVersion] = useState<'v4' | 'v7'>('v4');
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  // Regenerating just bumps the nonce; the list itself is derived state.
  const [nonce, setNonce] = useState(0);
  const [generatedAt, setGeneratedAt] = useState(() => stampNow());

  const safeCount = Math.max(1, Math.min(100, Math.round(count) || 1));
  const uuids = useMemo(
    () =>
      Array.from({ length: safeCount }, () =>
        version === 'v4' ? uuidV4() : uuidV7()
      ),
    [version, safeCount, nonce]
  );

  const regenerate = () => {
    setNonce((n) => n + 1);
    setGeneratedAt(stampNow());
  };

  const output = renderList(uuids, uppercase, noHyphens);

  return (
    <div className="space-y-5">
      <Panel label="Options">
        <div className="flex flex-wrap items-end gap-x-10 gap-y-6">
          <div>
            <Label className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50">
              Version
            </Label>
            <Segmented
              ariaLabel="UUID version"
              value={version}
              onChange={(value) => setVersion(value)}
              options={[
                { value: 'v4', label: 'v4 — random' },
                { value: 'v7', label: 'v7 — time-ordered' },
              ]}
              className="mt-2"
            />
          </div>

          <div>
            <Label
              htmlFor="uuid-count"
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50"
            >
              Count · 1–100
            </Label>
            <Input
              id="uuid-count"
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
              className="mt-2 h-10 w-24 font-mono text-[13px]"
            />
          </div>

          <div className="flex items-center gap-3 pb-2.5">
            <Switch id="uuid-upper" checked={uppercase} onCheckedChange={setUppercase} />
            <Label
              htmlFor="uuid-upper"
              className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.15em] text-ink/55"
            >
              Uppercase
            </Label>
          </div>

          <div className="flex items-center gap-3 pb-2.5">
            <Switch id="uuid-hyphens" checked={noHyphens} onCheckedChange={setNoHyphens} />
            <Label
              htmlFor="uuid-hyphens"
              className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.15em] text-ink/55"
            >
              No hyphens
            </Label>
          </div>

          <button
            type="button"
            onClick={regenerate}
            className="mb-0.5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-paper transition-colors duration-300 hover:bg-viridian"
          >
            <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
            Regenerate
          </button>
        </div>
      </Panel>

      <Panel
        label={`UUIDs — version ${version.toUpperCase()}`}
        accent="bg-viridian"
        actions={
          <>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
              {generatedAt}
            </span>
            <CopyButton value={() => output} label="Copy all" ariaLabel="Copy all UUIDs" />
          </>
        }
        bodyClassName="p-0"
      >
        <ul className="max-h-[420px] divide-y divide-ink/10 overflow-auto">
          {uuids.map((uuid, i) => {
            let value = noHyphens ? uuid.replace(/-/g, '') : uuid;
            if (uppercase) value = value.toUpperCase();
            return (
              <li key={uuid} className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="min-w-0 truncate font-mono text-[13px] text-ink/85">
                  <span className="me-3 select-none text-ink/30">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {value}
                </span>
                <CopyButton value={() => value} ariaLabel={`Copy UUID ${i + 1}`} />
              </li>
            );
          })}
        </ul>
      </Panel>

      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
        Generated with crypto.getRandomValues — cryptographically secure, entirely local.
      </p>
    </div>
  );
}
