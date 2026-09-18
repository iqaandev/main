/*
 * IQAAN Tools registry — single source of truth for the /tools hub,
 * tool routes, metadata, and the sitemap. Content is English-only this
 * release; the nav label is translated in both dictionaries.
 */

export type ToolCategory =
  | 'Formatter'
  | 'Converter'
  | 'Inspector'
  | 'Tester'
  | 'Generator'
  | 'Designer';

export interface ToolFaq {
  q: string;
  a: string;
}

export interface Tool {
  /** URL slug under /tools/ */
  slug: string;
  /** Display name — also the H1 and the <title> lead */
  name: string;
  /** One-sentence subtitle under the H1, and the hub row description */
  short: string;
  /** 2–3 keyword-rich sentences — used as the meta description */
  description: string;
  /** 2–3 paragraphs for the on-page "About this tool" SEO block */
  longDescription: string[];
  faq: ToolFaq[];
  category: ToolCategory;
}

/** Canonical site origin — used by sitemap.ts, robots.txt and OG metadata. */
export const SITE_URL = 'https://iqaan.com';

export const tools: Tool[] = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    short: 'Format, minify, and validate JSON with syntax highlighting and instant error pinpointing.',
    description:
      'Free online JSON formatter, validator, and minifier. Pretty-print JSON with 2 or 4 space indentation, syntax highlighting, key counts and depth stats, and precise line-and-column error messages — all in your browser.',
    longDescription: [
      'Paste any JSON — an API response, a config file, a payload from your logs — and it is formatted, validated, and highlighted instantly. Choose between 2-space and 4-space indentation, switch to minified output for production payloads, and read structure at a glance with live statistics for byte size, key count, and maximum nesting depth.',
      'When JSON is malformed, the formatter does more than shrug: it reports the exact line and column where parsing failed and quotes the offending snippet, so a trailing comma or an unescaped quote takes seconds to find instead of minutes. Output can be copied to the clipboard or downloaded as a .json file.',
      'Everything runs locally in your browser using the same parsing engine JavaScript ships with. No data is uploaded, logged, or retained — which makes this formatter safe for payloads you would never paste into a hosted service.',
    ],
    faq: [
      {
        q: 'Is my JSON sent to a server?',
        a: 'No. Parsing, formatting, and highlighting all happen in your browser with JavaScript’s built-in JSON engine. Nothing leaves your machine, so the tool is safe for confidential payloads.',
      },
      {
        q: 'What does the validator check?',
        a: 'It runs a full JSON.parse on every keystroke (debounced). If parsing fails, you get the exact line and column of the offending character together with a short quoted snippet of the broken region.',
      },
      {
        q: 'What do the stats mean?',
        a: 'Bytes is the UTF-8 size of the current output, keys counts every object key at any depth, and depth is the deepest level of nested objects or arrays — useful for spotting structures that are flatter or deeper than expected.',
      },
      {
        q: 'Can I minify JSON too?',
        a: 'Yes. Switch the action from Format to Minify to strip all whitespace into a single production-ready line, then copy or download the result.',
      },
    ],
    category: 'Formatter',
  },
  {
    slug: 'base64',
    name: 'Base64 Encoder / Decoder',
    short: 'Encode and decode Base64 bidirectionally — UTF-8 safe, URL-safe alphabet, files included.',
    description:
      'Free online Base64 encoder and decoder. Convert text to Base64 and back with full UTF-8 support, switch to the URL-safe alphabet, and turn any file into a Base64 string — entirely in your browser.',
    longDescription: [
      'Base64 is everywhere — data URIs, HTTP basic auth headers, JWTs, email attachments — and it breaks quietly the moment a non-ASCII character or a URL-reserved symbol sneaks in. This converter encodes and decodes bidirectionally and is UTF-8 safe by construction: text goes through TextEncoder and TextDecoder rather than naive btoa, so Arabic, Chinese, and emoji survive the round trip.',
      'A URL-safe toggle switches the alphabet to - and _ with stripped padding, the format APIs and JWT libraries expect. Swap direction with one click, and drop a file onto the encoder to get its Base64 representation with a size readout — handy for inline images and attachments in JSON payloads.',
      'Like every IQAAN tool, the conversion runs entirely client-side. Files are read with the browser FileReader and never leave your device.',
    ],
    faq: [
      {
        q: 'Why do I get an error decoding some Base64 strings?',
        a: 'The decoder accepts both the standard and URL-safe alphabets and adds missing padding automatically. If the string still fails, it contains characters that are not valid Base64 — commonly the result of copying only part of a token or of a %xx escape that was never decoded.',
      },
      {
        q: 'What is the URL-safe alphabet?',
        a: 'URL-safe Base64 replaces + with - and / with _, and typically drops the = padding. Those characters are reserved in URLs and can corrupt query parameters, which is why JWTs and many APIs use this variant.',
      },
      {
        q: 'Does it handle non-English text and emoji?',
        a: 'Yes. Encoding converts text to UTF-8 bytes first and decoding converts bytes back with a strict UTF-8 decoder, so any Unicode text round-trips correctly — and genuinely invalid byte sequences are reported instead of silently producing garbage.',
      },
      {
        q: 'Is there a size limit for files?',
        a: 'The only limit is your browser’s memory. A few megabytes encode in a blink; very large files produce very large strings, which is a Base64 property, not a tool limitation.',
      },
    ],
    category: 'Converter',
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    short: 'Decode JSON Web Token headers and payloads, with exp/iat/nbf status badges and readable timestamps.',
    description:
      'Free online JWT decoder. Inspect JSON Web Token header, payload, and signature, see exp, iat, and nbf claims as human-readable timestamps, and get instant Valid, Expired, or Not yet valid status — decoding only, fully client-side.',
    longDescription: [
      'Paste a JSON Web Token and it splits into its three parts — header, payload, signature — each shown in its own panel with pretty-printed JSON. The claims that matter most for debugging get special treatment: exp, iat, and nbf are rendered as human-readable local timestamps alongside the raw epoch values.',
      'A status badge summarizes the token’s lifecycle at a glance: Valid while now falls between nbf/not-before and exp/expiry, Expired once the expiry has passed, Not yet valid before the nbf date, and No expiry when the token carries no exp claim at all. Registered claims like sub, iss, aud, and jti are labelled so you can read a token the way the library that issued it intended.',
      'Decoding is not verification. This tool reads the unencrypted parts of a JWT and makes no attempt to validate the signature — that requires the signing secret or public key and belongs server-side. Nothing you paste here is transmitted anywhere; the token is decoded in your browser.',
    ],
    faq: [
      {
        q: 'Does this tool verify JWT signatures?',
        a: 'No — deliberately. Verifying a signature requires the secret or public key of the issuing party, and that is a server-side responsibility. This decoder only reads and pretty-prints the unencrypted header and payload so you can inspect claims safely.',
      },
      {
        q: 'What do the status badges mean?',
        a: 'Valid means the current time is after nbf (if present) and before exp. Expired means exp is in the past, Not yet valid means nbf is still in the future, and No expiry means the token has no exp claim — it is valid indefinitely until revoked.',
      },
      {
        q: 'Why won’t my five-part token decode?',
        a: 'Tokens with five dot-separated parts are JWEs — encrypted JSON Web Encryption tokens. Their payload is ciphertext by design, so there is nothing readable to decode without the decryption key.',
      },
      {
        q: 'Is it safe to paste production tokens here?',
        a: 'The token never leaves your browser — there is no network call at all. The usual caution still applies: treat any valid credential as a secret and revoke tokens that have been shared carelessly.',
      },
    ],
    category: 'Inspector',
  },
  {
    slug: 'cron-explainer',
    name: 'Cron Expression Explainer',
    short: 'Translate cron expressions into plain English with live validation and the next five run times.',
    description:
      'Free online cron expression explainer. Convert any 5-field crontab schedule into plain English, validate each field as you type, and compute the next five run times in your timezone — presets included, all in your browser.',
    longDescription: [
      'Cron is fifty years old and still running the world’s scheduled jobs — but 30 4 * * 1-5 reads like noise to anyone who did not write it. This explainer turns each expression into a plain-English sentence, validates every field live (minutes 0–59, hours 0–23, month and weekday names included), and supports the full syntax: asterisks, steps, lists, ranges, and the ? placeholder.',
      'Beyond translation, the tool computes the next five times the expression will fire, shown in your local timezone with the zone name displayed. The search is bounded to one year ahead, so impossible expressions — say, the 31st of February — return a friendly note instead of hanging the tab. Six common presets, from every-five-minutes to weekday-morning at 9 AM, load with one click.',
      'Everything is computed client-side, including the schedule search, so the page works offline once loaded and your expressions stay private.',
    ],
    faq: [
      {
        q: 'Which cron dialect does this support?',
        a: 'Standard 5-field crontab syntax: minute, hour, day-of-month, month, day-of-week — with *, lists, ranges, steps (*/n and a-b/n), three-letter month and weekday names, and ? as a no-op placeholder. Six-field Quartz-style expressions with seconds are not supported.',
      },
      {
        q: 'How are next run times computed?',
        a: 'The tool walks forward minute by minute from now, in your timezone, and stops when it has found five matches or crossed one year. DST transitions are handled by the same timezone engine your browser uses for everything else.',
      },
      {
        q: 'Why does my expression say it never matches?',
        a: 'Some combinations are impossible — the 31st day of a short month, or February 30th. If nothing matches within a year, the tool says so instead of pretending: check your day-of-month and month fields.',
      },
      {
        q: 'What happens when both day-of-month and day-of-week are set?',
        a: 'Classic cron (Vixie) semantics: when both fields are restricted, the job runs when either matches, not both. This explainer follows that convention and renders it faithfully in the English sentence.',
      },
    ],
    category: 'Inspector',
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    short: 'Test regular expressions live with match highlighting, capture-group tables, and a syntax cheatsheet.',
    description:
      'Free online regex tester. Experiment with JavaScript regular expressions in real time — live match highlighting, global/case-insensitive/multiline/dotall/unicode flags, capture group tables with positions, inline error messages, and a compact cheatsheet.',
    longDescription: [
      'Regular expressions are a write-only language until you can see them match. Type a pattern, flip the g, i, m, s, and u flags with one click, and watch matches light up in your test text with alternating tints — a live count keeps score. Invalid patterns surface the interpreter’s own error message inline instead of a blank panel.',
      'Capture groups get a table of their own: for every match, each group’s captured text and character position, so you can verify that what you captured is what you meant to capture. A compact cheatsheet covers the everyday vocabulary — \d, \w, quantifiers, ranges, groups, named groups, and lookarounds — because nobody remembers lookahead syntax from memory.',
      'The tester uses your browser’s native RegExp engine, so what matches here matches in your JavaScript exactly. Patterns and test text are processed locally and never uploaded.',
    ],
    faq: [
      {
        q: 'Which regex flavor is used?',
        a: 'Your browser’s native JavaScript RegExp engine (ECMAScript). That means no lookbehind limitations in modern browsers, Unicode property escapes under the u flag, and behaviour identical to running the pattern in your own code.',
      },
      {
        q: 'What do the flags g, i, m, s, and u do?',
        a: 'g finds all matches rather than the first; i matches case-insensitively; m makes ^ and $ match line boundaries; s lets . match newlines; u enables full Unicode matching and property escapes like \p{L}.',
      },
      {
        q: 'Why does my pattern show zero matches?',
        a: 'Test with and without the g flag — patterns written with ^ or $ anchors depend on the m flag for multiline text, and . does not cross lines without s. The inline error panel also shows the engine’s message if the pattern itself fails to compile.',
      },
      {
        q: 'Is there a limit on test text size?',
        a: 'Highlighting is capped for very large inputs to keep the page responsive; matching itself runs natively and stays fast even on tens of thousands of characters.',
      },
    ],
    category: 'Tester',
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    short: 'Generate RFC-compliant UUID v4 and v7 identifiers in bulk, with per-item and copy-all export.',
    description:
      'Free online UUID generator. Create cryptographically random RFC 4122 version 4 UUIDs and time-ordered version 7 UUIDs in bulk — uppercase and no-hyphen formats, one-click regenerate, copy individually or all at once.',
    longDescription: [
      'Every identifier you generate here is produced by crypto.getRandomValues, the browser’s cryptographically secure random source — the same primitive production libraries use. Version 4 UUIDs are 122 bits of pure randomness for when you need an opaque unique ID. Version 7 UUIDs lead with a 48-bit millisecond timestamp, so they sort chronologically in databases and indexes — increasingly the default choice for new systems.',
      'Generate between 1 and 100 at a time, flip on uppercase or hyphen-free output to match your system’s convention, and copy any single UUID with one click or the whole batch as a list. The regenerate button produces a fresh set instantly — no page reload, no server round trip.',
      'UUIDs are generated entirely in your browser. There is no rate limit, no logging of generated values, and no chance of a collision with anyone else’s batch: 122 bits of entropy makes that a practical impossibility.',
    ],
    faq: [
      {
        q: 'What is the difference between UUID v4 and v7?',
        a: 'Version 4 is fully random. Version 7 begins with a millisecond timestamp followed by random bits, which makes IDs both unique and roughly time-ordered — friendlier to B-tree database indexes and to debugging, at the cost of revealing generation time.',
      },
      {
        q: 'Are these UUIDs safe to use in production?',
        a: 'Yes. They are built on crypto.getRandomValues, the browser’s CSPRNG, and follow RFC 4122/9562 layout including correct version and variant bits. The output is equivalent to what a server-side library would produce.',
      },
      {
        q: 'What are the chances of a collision?',
        a: 'Astronomically small. A version 4 UUID carries 122 random bits; you would need to generate billions per year for millions of years to approach a realistic collision probability.',
      },
      {
        q: 'Can I generate UUIDs without hyphens or in uppercase?',
        a: 'Both are one-click options. Some systems store identifiers as 32 hex characters, others as canonical lowercase-with-hyphens — the generator matches whichever convention your codebase uses.',
      },
    ],
    category: 'Generator',
  },
  {
    slug: 'timestamp-converter',
    name: 'Unix Timestamp Converter',
    short: 'Convert unix timestamps, ISO 8601 strings, and human dates in lockstep, with a live now ticker.',
    description:
      'Free online Unix timestamp converter. Translate epoch seconds or milliseconds, ISO 8601 strings, and human-readable dates in real time across any timezone, with relative output like “in 3 days” and a live now ticker.',
    longDescription: [
      'Epoch timestamps are compact and unambiguous — and unreadable. This converter keeps three synchronized fields: a unix timestamp (seconds or milliseconds, your call), the ISO 8601 representation, and a human-readable local date-time. Type into any one of them and the other two update instantly; invalid input gets a friendly inline note rather than a wrong answer.',
      'The timezone selector is populated from the international database your browser ships with, so you can render the same instant in Tokyo, Riyadh, or UTC without doing offset arithmetic in your head. A relative line adds the human frame of reference — “in 3 days”, “2 hours ago” — and the live now ticker at the top keeps the current unix time one glance away, with a copy button.',
      'Ambiguity is the classic timestamp bug: the same epoch reads differently in every timezone. This tool always names the zone it is displaying, so what you see is what your logs mean.',
    ],
    faq: [
      {
        q: 'Should I use seconds or milliseconds?',
        a: 'JavaScript and Java use milliseconds; Unix tools and most APIs use seconds. The unit toggle switches interpretation — the converter guesses sensibly when you paste, since a ten-digit epoch is seconds and thirteen digits is milliseconds.',
      },
      {
        q: 'Which ISO 8601 formats are accepted?',
        a: 'Anything the JavaScript date parser accepts: 2026-09-18T14:30:00Z, with offsets like +03:00, and plain dates like 2026-09-18. Zoned output is always shown with the selected timezone named, so there is no ambiguity about what you copied.',
      },
      {
        q: 'How accurate is the now ticker?',
        a: 'It updates every second from your device clock. The copy button grabs the exact value at click time — unix seconds by default — for quick use in logs and queries.',
      },
      {
        q: 'What does the relative line mean?',
        a: 'It is the difference between the converted instant and now, expressed the way people speak: “in 3 days”, “2 hours ago”. It is computed from the same value shown in the absolute fields, using your browser’s locale.',
      },
    ],
    category: 'Converter',
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    short: 'Compute SHA-1, SHA-256, SHA-384, and SHA-512 digests of text or files simultaneously.',
    description:
      'Free online SHA hash generator. Compute SHA-1, SHA-256, SHA-384, and SHA-512 checksums of any text or file at the same time using native SubtleCrypto — copy digests as hex, with a live input size readout.',
    longDescription: [
      'Paste text or drop in a file and all four digests are computed at once — SHA-1 for legacy checksum compatibility, and the SHA-2 family (256, 384, 512) that everything from TLS certificates to package registries relies on. Each row shows the algorithm name, the full hex digest, and a copy button; the input size in bytes is displayed so you can verify you hashed exactly what you meant to hash.',
      'The hashing is done by crypto.subtle — the browser’s native cryptography module, the same code path that secures HTTPS. It is fast: megabytes hash in milliseconds. One deliberate omission: MD5 is not offered, because SubtleCrypto does not implement it and MD5 has been cryptographically broken for decades; legacy migration is the only reason to reach for it, and dedicated offline tools serve that better.',
      'Checksums are how the web says “this exact file, not a bit different”. Because everything here runs client-side, you can hash sensitive documents — contracts, database dumps, private keys — without sending a byte anywhere.',
    ],
    faq: [
      {
        q: 'Why is there no MD5?',
        a: 'The Web Crypto API (SubtleCrypto) deliberately omits MD5 because it is cryptographically broken. If you need an MD5 digest for a legacy system, use a dedicated offline tool — and plan the migration to SHA-256.',
      },
      {
        q: 'Which algorithm should I choose?',
        a: 'SHA-256 is today’s sensible default for checksums and signatures. SHA-512 is equally secure and often faster on 64-bit CPUs. SHA-1 remains useful only for verifying old checksums and is not recommended for new purposes.',
      },
      {
        q: 'How fast is it, and is there a size limit?',
        a: 'Hashing runs natively at millions of bytes per second. Files of tens of megabytes complete in a moment; the practical limit is your browser’s available memory, since the digest is computed in one pass.',
      },
      {
        q: 'Can I verify a file download with this?',
        a: 'Yes — that is the classic use. The publisher provides a SHA-256 digest; you hash the downloaded file here and compare. If every hex character matches, the file is bit-for-bit what the publisher released.',
      },
    ],
    category: 'Generator',
  },
  {
    slug: 'color-studio',
    name: 'Color & Contrast Studio',
    short: 'Build palettes with harmonies and WCAG contrast checks — hex, RGB, and HSL in lockstep.',
    description:
      'Free online color studio and WCAG contrast checker. Convert between hex, RGB, and HSL, generate complementary, analogous, triadic, and monochrome palettes, and test text contrast against AA and AAA thresholds.',
    longDescription: [
      'Start from any color — hex, RGB, or HSL, or the native picker — and the studio keeps every representation synchronized while you work. A large swatch shows the color as it will actually appear, and every value copies with one click in whichever notation your codebase wants.',
      'From a base color, harmony rows generate complementary, analogous, triadic, and monochrome companions; click any swatch to adopt it as the new base and explore in a direction you like. The contrast checker pairs any two colors and computes the exact WCAG ratio, with pass and fail badges for AA and AAA at both normal and large text sizes — the difference between an interface that merely looks good and one that everyone can read.',
      'Contrast math follows the WCAG 2.x relative-luminance formula precisely, so the ratio shown is the one accessibility audits will compute. The studio runs entirely in your browser; palettes never leave your machine.',
    ],
    faq: [
      {
        q: 'What contrast ratio do I need to pass WCAG?',
        a: 'AA requires 4.5:1 for normal text and 3:1 for large text (18.7px bold or 24px regular and above). AAA — the enhanced tier — requires 7:1 and 4.5:1 respectively. The checker badges all four thresholds for any color pair.',
      },
      {
        q: 'How are the harmonies calculated?',
        a: 'In HSL space: complementary rotates the hue 180°, analogous uses ±30°, triadic ±120°, and monochrome keeps the hue while stepping lightness. They are starting points refined by taste — the studio makes adopting any swatch as the new base a single click.',
      },
      {
        q: 'Which color formats can I copy?',
        a: 'Every color is presented in hex, rgb(), and hsl() notations, each with its own copy button — plus the native picker for grabbing colors visually.',
      },
      {
        q: 'Does the checker cover non-text elements?',
        a: 'The WCAG 1.4.11 non-text contrast requirement also uses a 3:1 threshold against adjacent colors. The normal-text AA badge at 3:1 doubles as that check for UI components and graphical objects.',
      },
    ],
    category: 'Designer',
  },
  {
    slug: 'csv-converter',
    name: 'CSV Converter',
    short: 'Convert CSV to JSON or Markdown, and JSON back to CSV — RFC 4180 aware, delimiter auto-detected.',
    description:
      'Free online CSV to JSON, JSON to CSV, and CSV to Markdown converter. An RFC 4180-aware parser handles quoted fields, embedded commas and newlines; delimiters are auto-detected and headers are optional.',
    longDescription: [
      'CSV looks simple and is not: quotes wrap commas, doubled quotes escape quotes, and fields can contain newlines. This converter parses the format properly — the way spreadsheets write it — and converts to pretty-printed JSON with a header toggle, or to a clean Markdown table ready to paste into documentation.',
      'Going the other way, JSON becomes CSV: arrays of objects are flattened one level deep (nested objects become dot-notation columns), values are quoted exactly when needed, and the delimiter is your choice. The parser auto-detects commas, semicolons, and tabs on input, so European exports and TSV files work without configuration. Row and column counts are shown with every result.',
      'Conversion happens entirely in your browser, which matters more here than anywhere: CSV files are so often customer lists, exports, or financial data. Nothing is uploaded, and results can be copied or downloaded as files.',
    ],
    faq: [
      {
        q: 'Which delimiters are supported?',
        a: 'Commas, semicolons, and tabs — auto-detected on input by counting candidates outside quoted fields. The JSON-to-CSV direction lets you pick the delimiter explicitly.',
      },
      {
        q: 'How are quoted fields handled?',
        a: 'Per RFC 4180: fields may be wrapped in double quotes, embedded commas and newlines inside quotes are preserved, and a doubled quote inside a quoted field is a literal quote. Rows may be terminated by CRLF or LF.',
      },
      {
        q: 'What does the header toggle do?',
        a: 'With headers on, the first row becomes object keys and the rest become values — the JSON shape most APIs expect. With headers off, every row becomes an array of strings.',
      },
      {
        q: 'How does JSON to CSV flattening work?',
        a: 'One level deep: nested objects become dot-notation columns (user.name), arrays are JSON-encoded as strings, and null becomes an empty field. Consistent keys across rows produce a stable column order.',
      },
    ],
    category: 'Converter',
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
