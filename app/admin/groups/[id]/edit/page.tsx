'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EditGroupPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams() as { id?: string };
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/groups/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data?.id) {
          setSlug(data.slug || '');
          setTitle(data.title || '');
          setDescription(data.description || '');
        }
      })
      .catch(err => console.error('Failed to load group', err))
      .finally(() => setLoading(false));
  }, [id]);


  const handleSave = async () => {
    if (!id) return;
    if (!slug || !title) return alert('Slug and title required');
    setSaving(true);
    try {
      const res = await fetch(`/api/groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title, description })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Update failed');
      }
      router.push('/admin/groups');
    } catch (err: any) {
      alert(err.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === 'loading') return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Edit Group</h1>
            <p className="text-sm text-gray-500">Update group details</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/groups" className="px-4 py-2 bg-white border rounded-xl">Back</Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <label className="block text-sm text-gray-600">Slug</label>
          <input className="w-full border p-2 rounded-md mt-1 mb-4" value={slug} onChange={(e) => setSlug(e.target.value)} />

          <label className="block text-sm text-gray-600">Title</label>
          <input className="w-full border p-2 rounded-md mt-1 mb-4" value={title} onChange={(e) => setTitle(e.target.value)} />

          <label className="block text-sm text-gray-600">Description</label>
          <textarea className="w-full border p-2 rounded-md mt-1 mb-4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of this group..." rows={3} />


          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-xl">{saving ? 'Saving...' : 'Save'}</button>
            <Link href="/admin/groups" className="px-4 py-2 bg-white border rounded-xl">Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
