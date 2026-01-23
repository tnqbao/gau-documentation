'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Folder, Plus, Trash2, Edit3 } from 'lucide-react';

export default function AdminGroupsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [groups, setGroups] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') fetchGroups();
  }, [status]);

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/groups');
      const data = await res.json();
      setGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load groups', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete group "${title}"? This will not delete documents.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/groups/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchGroups();
    } catch (err) {
      console.error('Failed to delete group', err);
      alert('Failed to delete group');
    } finally {
      setDeletingId(null);
    }
  };

  if (status === 'loading' || loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Groups</h1>
            <p className="text-sm text-gray-500">Manage documentation groups and thumbnails</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/groups/new" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl">
              <Plus size={16} />
              New Group
            </Link>
            <Link href="/admin" className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-xl">
              <Folder size={16} />
              Back
            </Link>
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border">No groups yet</div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">
            {groups.map((g: any) => (
              <div key={g.id} className="flex items-center gap-4 p-4 border-b last:border-b-0">
                <div className="w-24 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {g.thumbnail ? <img src={g.thumbnail} alt={g.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{g.title}</div>
                  <div className="text-xs text-gray-500">/{g.slug}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/groups/${g.id}/edit`} className="p-2 rounded-md hover:bg-gray-50">
                    <Edit3 size={16} />
                  </Link>
                  <button onClick={() => handleDelete(g.id, g.title)} disabled={deletingId === g.id} className="p-2 rounded-md hover:bg-red-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

