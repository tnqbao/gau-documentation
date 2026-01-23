'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import AdminFloatingBar from '@/components/AdminFloatingBar';
import { ArrowLeft } from 'lucide-react';

const NotionEditor = dynamic(() => import('@/components/NotionEditor'), {
  ssr: false,
  loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-xl"></div>,
});

export default function NewDocumentPage() {
  const { status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('<p>Start writing your document...</p>');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!slug.trim()) {
      setError('Please enter a URL slug');
      return;
    }

    setError('');
    setSaving(true);

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, content_md: content })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create document');
      }

      const doc = await res.json();
      router.push(`/docs/${doc.slug}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => router.push('/admin');

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminFloatingBar
        isEditing={true}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
        documentTitle={title || 'New Document'}
      />

      <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-900 transition-colors text-sm flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Documents
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled"
          className="text-4xl md:text-5xl font-bold text-gray-900 w-full border-0 focus:outline-none placeholder-gray-300 mb-4"
          autoFocus
        />

        <div className="mb-8 flex items-center gap-2 text-sm">
          <span className="text-gray-400">/docs/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="url-slug"
            className="text-gray-600 border-0 border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 py-1 px-1 bg-transparent"
          />
        </div>

        <NotionEditor content={content} onChange={setContent} editable={true} />
      </main>
    </div>
  );
}

