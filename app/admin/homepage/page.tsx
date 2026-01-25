'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, ExternalLink as ExternalLinkIcon } from 'lucide-react';
import Image from 'next/image';

interface ExternalLink {
  id: number;
  title: string;
  description?: string | null;
  url: string;
  thumbnail?: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export default function AdminHomepage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [links, setLinks] = useState<ExternalLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // Load external links
  useEffect(() => {
    async function loadLinks() {
      try {
        const response = await fetch('/api/external-links');
        if (response.ok) {
          const data = await response.json();
          setLinks(data);
        } else {
          console.error('Failed to load external links');
        }
      } catch (error) {
        console.error('Error loading external links:', error);
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      loadLinks();
    }
  }, [status]);

  const handleAddLink = () => {
    const newLink: ExternalLink = {
      id: 0, // Temporary ID for new links
      title: 'New Link',
      description: '',
      url: 'https://example.com',
      thumbnail: null,
      order_index: links.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setLinks([...links, newLink]);
  };

  const handleUpdateLink = (index: number, field: string, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setLinks(updatedLinks);
  };

  const handleDeleteLink = (index: number) => {
    if (confirm('Are you sure you want to delete this link?')) {
      const updatedLinks = links.filter((_, i) => i !== index);
      setLinks(updatedLinks);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updatedLinks = [...links];
    [updatedLinks[index - 1], updatedLinks[index]] = [updatedLinks[index], updatedLinks[index - 1]];
    setLinks(updatedLinks);
  };

  const handleMoveDown = (index: number) => {
    if (index === links.length - 1) return;
    const updatedLinks = [...links];
    [updatedLinks[index], updatedLinks[index + 1]] = [updatedLinks[index + 1], updatedLinks[index]];
    setLinks(updatedLinks);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Separate new links (id === 0) from existing ones
      const newLinks = links.filter(link => link.id === 0);
      const existingLinks = links.filter(link => link.id !== 0);

      // Create new links
      for (const newLink of newLinks) {
        await fetch('/api/external-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newLink.title,
            description: newLink.description,
            url: newLink.url,
            thumbnail: newLink.thumbnail,
            order_index: newLink.order_index
          })
        });
      }

      // Update existing links
      await Promise.all(
        existingLinks.map((link, index) =>
          fetch(`/api/external-links/${link.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: link.title,
              description: link.description,
              url: link.url,
              thumbnail: link.thumbnail,
              order_index: index
            })
          })
        )
      );

      router.push('/');
    } catch (error) {
      console.error('Failed to save:', error);
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
                <p className="text-sm text-gray-500">Manage external links displayed on homepage</p>
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
                <Save size={16} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">External Links</h2>
            <button
              onClick={handleAddLink}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={16} />
              Add Link
            </button>
          </div>

          <div className="space-y-4">
            {links.length === 0 ? (
              <div className="text-center py-12">
                <ExternalLinkIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No external links yet</h3>
                <p className="text-gray-500 mb-4">Add your first external link to get started.</p>
                <button
                  onClick={handleAddLink}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add First Link
                </button>
              </div>
            ) : (
              links.map((link, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col gap-1 pt-2">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <GripVertical size={16} />
                      </button>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => handleUpdateLink(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter link title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL *
                          </label>
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => handleUpdateLink(index, 'url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Thumbnail URL
                          </label>
                          <input
                            type="url"
                            value={link.thumbnail || ''}
                            onChange={(e) => handleUpdateLink(index, 'thumbnail', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={link.description || ''}
                            onChange={(e) => handleUpdateLink(index, 'description', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter a brief description"
                          />
                        </div>

                        {link.thumbnail && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Preview
                            </label>
                            <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                              <Image
                                src={link.thumbnail}
                                alt={link.title}
                                width={400}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleDeleteLink(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {links.length > 0 && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

