'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Save, ArrowLeft, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';

interface Group {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  order?: number;
}

export default function EditHomePage() {
  const { status } = useSession();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchGroups();
    }
  }, [status]);

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/groups');
      const data = await res.json();
      setGroups(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateGroupDescription = (id: number, description: string) => {
    setGroups(groups.map(g => g.id === id ? { ...g, description } : g));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newGroups = [...groups];
    [newGroups[index], newGroups[index - 1]] = [newGroups[index - 1], newGroups[index]];
    setGroups(newGroups);
  };

  const moveDown = (index: number) => {
    if (index === groups.length - 1) return;
    const newGroups = [...groups];
    [newGroups[index], newGroups[index + 1]] = [newGroups[index + 1], newGroups[index]];
    setGroups(newGroups);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Update each group's description
      await Promise.all(
        groups.map(group =>
          fetch(`/api/groups/${group.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              slug: group.slug,
              title: group.title,
              description: group.description,
              thumbnail: group.thumbnail
            })
          })
        )
      );
      alert('✅ Homepage updated successfully!');
      router.push('/');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('❌ Failed to update homepage');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Homepage</h1>
                <p className="text-sm text-gray-500">Manage groups displayed on homepage</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Preview
              </Link>
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Edit group descriptions to show on homepage instead of page count</li>
            <li>• Use arrows to reorder groups</li>
            <li>• Leave description empty to show page count instead</li>
            <li>• Click "Manage Groups" to edit group title, slug, or thumbnail</li>
          </ul>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Groups ({groups.length})
          </h2>
          <Link
            href="/admin/groups"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <Plus size={18} />
            Manage Groups
          </Link>
        </div>

        {groups.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 mb-4">No groups yet. Create one to get started!</p>
            <Link
              href="/admin/groups/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              <Plus size={20} />
              Create First Group
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group, index) => (
              <div
                key={group.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    {group.thumbnail ? (
                      <img
                        src={group.thumbnail}
                        alt={group.title}
                        className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {group.title}
                        </h3>
                        <p className="text-sm text-gray-500">/docs/{group.slug}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <MoveUp size={18} />
                        </button>
                        <button
                          onClick={() => moveDown(index)}
                          disabled={index === groups.length - 1}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <MoveDown size={18} />
                        </button>
                        <Link
                          href={`/admin/groups/${group.id}/edit`}
                          className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          Edit Details
                        </Link>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (shown on homepage)
                      </label>
                      <textarea
                        value={group.description || ''}
                        onChange={(e) => updateGroupDescription(group.id, e.target.value)}
                        placeholder="Add a description to display on homepage instead of page count..."
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        rows={2}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Leave empty to show page count instead
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Admin
          </Link>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </main>
    </div>
  );
}

