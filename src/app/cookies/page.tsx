import type { Metadata } from 'next';
import LegalLayout from '@/components/legal/LegalLayout';
import { getLegalDocument } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Cookie Policy — IQAAN',
  description: 'Which cookies and browser storage iqaan.com uses.',
};

const doc = getLegalDocument('cookies')!;

export default function Page() {
  return <LegalLayout doc={doc} />;
}
