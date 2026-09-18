import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTool, tools, type Tool } from '@/lib/tools/registry';
import ToolLayout from '@/components/tools/ToolLayout';
import JsonFormatter from '@/components/tools/JsonFormatter';
import Base64Tool from '@/components/tools/Base64Tool';
import JwtDecoder from '@/components/tools/JwtDecoder';
import CronExplainer from '@/components/tools/CronExplainer';
import RegexTester from '@/components/tools/RegexTester';
import UuidGenerator from '@/components/tools/UuidGenerator';
import TimestampConverter from '@/components/tools/TimestampConverter';
import HashGenerator from '@/components/tools/HashGenerator';
import ColorStudio from '@/components/tools/ColorStudio';
import CsvConverter from '@/components/tools/CsvConverter';
import type { ComponentType } from 'react';

const toolComponents: Record<string, ComponentType> = {
  'json-formatter': JsonFormatter,
  base64: Base64Tool,
  'jwt-decoder': JwtDecoder,
  'cron-explainer': CronExplainer,
  'regex-tester': RegexTester,
  'uuid-generator': UuidGenerator,
  'timestamp-converter': TimestampConverter,
  'hash-generator': HashGenerator,
  'color-studio': ColorStudio,
  'csv-converter': CsvConverter,
};

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — Free Online Tool | IQAAN Tools`,
    description: tool.description,
    keywords: [tool.name.toLowerCase(), ...tool.short.split(' ').slice(0, 4).map((w) => w.toLowerCase()), 'free online tool'],
    openGraph: {
      title: `${tool.name} — Free Online Tool | IQAAN Tools`,
      description: tool.description,
      siteName: 'IQAAN',
      type: 'website',
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool: Tool | undefined = getTool(slug);
  if (!tool) notFound();

  const ToolComponent = toolComponents[slug];
  if (!ToolComponent) notFound();

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <ToolLayout tool={tool}>
      <script
        type="application/ld+json"
        // Static content from the registry, prerendered for crawlers.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ToolComponent />
    </ToolLayout>
  );
}
