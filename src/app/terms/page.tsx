import type { Metadata } from 'next';
import LegalLayout from '@/components/legal/LegalLayout';
import { getLegalDocument } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Terms of Service — IQAAN',
  description: 'The terms governing use of iqaan.com and its free calculators.',
};

const doc = getLegalDocument('terms')!;

export default function Page() {
  return <LegalLayout doc={doc} />;
}
