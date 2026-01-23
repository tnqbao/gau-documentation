import { getDocumentBySlug, getAdjacentDocuments } from '@/lib/db';
import { renderMarkdown } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import DocumentViewer from '@/components/DocumentViewer';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugString = slug.join('/');
  const document = getDocumentBySlug(slugString);

  if (!document) {
    return { title: 'Document Not Found' };
  }

  return {
    title: document.title,
    description: document.content_md.slice(0, 160).replace(/[#*`<>]/g, ''),
  };
}

export default async function DocumentPage({ params }: Props) {
  const { slug } = await params;
  const slugString = slug.join('/');
  const document = getDocumentBySlug(slugString);

  if (!document) {
    notFound();
  }

  const htmlContent = await renderMarkdown(document.content_md);
  const adjacentDocs = getAdjacentDocuments(slugString);

  return <DocumentViewer document={document} htmlContent={htmlContent} adjacentDocs={adjacentDocs} />;
}

// Không cache để luôn hiển thị nội dung mới nhất
export const dynamic = 'force-dynamic';
export const revalidate = 0;
