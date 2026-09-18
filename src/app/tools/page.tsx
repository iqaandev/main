import type { Metadata } from 'next';
import ToolsIndex from '@/components/tools/ToolsIndex';

export const metadata: Metadata = {
  title: 'Free Online Developer Tools — IQAAN Tools',
  description:
    'Ten free, privacy-first developer tools that run entirely in your browser: JSON formatter, Base64, JWT decoder, cron explainer, regex tester, UUID generator, timestamp converter, hash generator, color studio, and CSV converter. Nothing is uploaded.',
  keywords: [
    'developer tools',
    'online tools',
    'json formatter',
    'base64',
    'jwt decoder',
    'cron explainer',
    'regex tester',
    'uuid generator',
    'unix timestamp converter',
    'hash generator',
    'color contrast checker',
    'csv to json',
  ],
  openGraph: {
    title: 'Free Online Developer Tools — IQAAN Tools',
    description:
      'Ten privacy-first developer tools that run entirely in your browser. Built with conviction by IQAAN.',
    siteName: 'IQAAN',
    type: 'website',
  },
};

export default function ToolsHubPage() {
  return <ToolsIndex />;
}
