import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/tools/registry';

/* Social share image — rendered from the brand fonts at 2400×1260. */
export const OG_IMAGES: NonNullable<Metadata['openGraph']>['images'] = [
  {
    url: '/og.png',
    width: 2400,
    height: 1260,
    type: 'image/png',
    alt: 'IQAAN — Software, built with conviction.',
  },
];

export const METADATA_BASE: Metadata['metadataBase'] = new URL(SITE_URL);
