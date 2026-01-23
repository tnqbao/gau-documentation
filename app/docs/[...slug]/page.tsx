import { getDocumentBySlug, getAdjacentDocuments, getGroupBySlug, getDocumentsByGroupId } from '@/lib/db';
import { renderMarkdown } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import DocumentViewer from '@/components/DocumentViewer';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugString = slug.join('/');

  const group = getGroupBySlug(slugString);
  if (group) {
    return { title: group.title, description: `Pages for ${group.title}` };
  }

  const document = getDocumentBySlug(slugString);
  if (!document) return { title: 'Document Not Found' };

  return {
    title: document.title,
    description: document.content_md.slice(0, 160).replace(/[#*`<>]/g, ''),
  };
}

export default async function DocumentPage({ params }: Props) {
  const { slug } = await params;
  const slugString = slug.join('/');

  // If slug matches a group, render group listing
  const group = getGroupBySlug(slugString);
  if (group) {
    const docs = getDocumentsByGroupId(group.id);

    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">{group.title}</h1>
          <p className="text-sm text-gray-500">{docs.length} page{docs.length !== 1 ? 's' : ''}</p>
        </header>

        <div className="space-y-3">
          {docs.map(d => (
            <Link key={d.id} href={`/docs/${d.slug}`} className="block p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="font-medium text-gray-900">{d.title}</div>
              {d.description ? (
                <div className="text-sm text-gray-500 mt-1">{d.description}</div>
              ) : (
                <div className="text-xs text-gray-400 mt-1">/{d.slug}</div>
              )}
            </Link>
          ))}
        </div>
      </div>
    );
  }

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
