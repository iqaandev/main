import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articles, getArticle } from '@/lib/insights/registry';
import ArticleLayout from '@/components/insights/ArticleLayout';
import { OG_IMAGES } from '@/lib/seo';

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.titleTag} | IQAAN Insights`,
    description: article.description,
    openGraph: {
      title: `${article.titleTag} | IQAAN Insights`,
      description: article.description,
      siteName: 'IQAAN',
      type: 'article',
      publishedTime: article.publishedISO,
      images: OG_IMAGES,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return <ArticleLayout article={article} />;
}
