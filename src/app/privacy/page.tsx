import type { Metadata } from 'next';
import LegalLayout from '@/components/legal/LegalLayout';
import { getLegalDocument } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy — IQAAN',
  description: 'How IQAAN collects, uses, and protects information on iqaan.com.',
};

const doc = getLegalDocument('privacy')!;

export default function Page() {
  return <LegalLayout doc={doc} />;
}
