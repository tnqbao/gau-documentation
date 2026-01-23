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
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('<p>Start writing your document...</p>');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [groups, setGroups] = useState<Array<{ id: number; title: string }>>([]);
  const [groupId, setGroupId] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/groups')
        .then(r => r.json())
        .then(data => Array.isArray(data) ? setGroups(data) : setGroups([]))
        .catch(err => console.error('Failed to load groups', err));
    }
  }, [status]);

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
        body: JSON.stringify({ title, description, slug, content_md: content, group_id: groupId })
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

        <div className="flex items-start gap-6">
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Untitled"
              className="text-4xl md:text-5xl font-bold text-gray-900 w-full border-0 focus:outline-none placeholder-gray-300 mb-2"
              autoFocus
            />

            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a short description..."
              className="text-lg text-gray-500 w-full border-0 focus:outline-none placeholder-gray-300 mb-4"
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
          </div>

          <aside className="w-48">
            <div className="mb-4">
              <label className="text-sm text-gray-500">Group</label>
              <div className="mt-2">
                <select
                  value={groupId ?? ''}
                  onChange={(e) => setGroupId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full border border-gray-200 rounded-md p-2"
                >
                  <option value="">Uncategorized</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
                <div className="mt-2 text-xs text-gray-500">
                  Select which group this page belongs to.
                </div>
                <div className="mt-3">
                  <Link href="/admin/groups" className="text-sm text-blue-600 hover:underline">Manage groups</Link>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500">Created: will be set on save</div>
            <div className="text-xs text-gray-500 mt-1">Updated: will be set on save</div>
          </aside>
        </div>
      </main>
    </div>
  );
}
