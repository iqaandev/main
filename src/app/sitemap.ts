import type { MetadataRoute } from 'next';
import { SITE_URL, tools } from '@/lib/tools/registry';
import { legalDocuments } from '@/lib/legal';
import { articles } from '@/lib/insights/registry';

// Required for metadata routes under output: "export".
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/insights`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...articles.map((article) => ({
      url: `${SITE_URL}/insights/${article.slug}`,
      lastModified: new Date(article.publishedISO),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...tools.map((tool) => ({
      url: `${SITE_URL}/tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...legalDocuments.map((doc) => ({
      url: `${SITE_URL}/${doc.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    })),
  ];
}
