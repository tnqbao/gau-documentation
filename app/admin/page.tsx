'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminFloatingBar from '@/components/AdminFloatingBar';
import { FileText, Plus, Trash2, ExternalLink, Clock, Download, Upload, Folder, ChevronDown, ChevronRight } from 'lucide-react';

interface Group {
  id: number;
  slug: string;
  title: string;
  thumbnail?: string | null;
}

interface Document {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  content_md: string;
  created_at: string;
  updated_at: string;
  group_id?: number | null;
  group?: Group | null;
}

export default function AdminDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [importing, setImporting] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDocuments();
    }
  }, [status]);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setDeleteId(id);
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      fetchDocuments();
    } catch (error) {
      console.error('Failed to delete document:', error);
    } finally {
      setDeleteId(null);
    }
  };

  const handleExportPagesMap = async () => {
    try {
      const response = await fetch('/api/export');
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'docs.db';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export database:', error);
      alert('Failed to export database');
    }
  };

  const handleImportSitemap = async () => {
    const confirmed = confirm(
      '⚠️ WARNING: This will replace ALL current documents with the imported database.\n\n' +
      'Are you sure you want to continue? This action CANNOT be undone!'
    );

    if (!confirmed) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.db,.sqlite,.sqlite3';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Double confirmation
      const doubleConfirm = confirm(
        `You selected: ${file.name}\n\n` +
        'This will PERMANENTLY REPLACE all current documents.\n\n' +
        'Are you absolutely sure?'
      );

      if (!doubleConfirm) return;

      setImporting(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/import', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Import failed');
        }

        alert('✅ Database imported successfully! The page will now reload.');
        window.location.reload();
      } catch (error) {
        console.error('Failed to import database:', error);
        alert(`❌ Failed to import database: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setImporting(false);
      }
    };

    input.click();
  };

  const toggleGroup = (groupKey: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  };

  // Gom nhóm documents theo group
  const groupedDocuments = documents.reduce((acc, doc) => {
    const groupKey = doc.group ? `group-${doc.group.id}` : 'ungrouped';
    const groupTitle = doc.group ? doc.group.title : 'Ungrouped Documents';

    if (!acc[groupKey]) {
      acc[groupKey] = {
        title: groupTitle,
        group: doc.group,
        documents: []
      };
    }
    acc[groupKey].documents.push(doc);
    return acc;
  }, {} as Record<string, { title: string; group: Group | null; documents: Document[] }>);

  // Debug logging
  console.log('Documents fetched:', documents.map(d => ({ id: d.id, title: d.title, group_id: d.group_id, group: d.group })));
  console.log('Grouped documents:', groupedDocuments);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminFloatingBar />

      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Documents</h1>
              <p className="text-gray-500">{documents.length} document{documents.length !== 1 ? 's' : ''} total</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleImportSitemap}
                disabled={importing}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm disabled:opacity-50"
              >
                <Upload size={16} />
                <span>{importing ? 'Importing...' : 'Import Sitemap'}</span>
              </button>
              <button
                onClick={handleExportPagesMap}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <Download size={16} />
                <span>Export Pages Map</span>
              </button>
              <Link
                href="/admin/groups"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Folder size={16} />
                <span>Manage Groups</span>
              </Link>
              <Link
                href="/admin/documents/new"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus size={16} />
                <span>New Document</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {documents.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-6">
              <FileText className="text-gray-400" size={40} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No documents yet</h3>
            <p className="text-gray-500 mb-8">Create your first document to start building your documentation.</p>
            <Link
              href="/admin/documents/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              <Plus size={20} />
              Create Your First Document
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedDocuments).map(([groupKey, { title, group, documents: groupDocs }]) => {
              const isCollapsed = collapsedGroups.has(groupKey);

              return (
                <div key={groupKey} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(groupKey)}
                    className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors border-b border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Folder size={20} className="text-blue-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-500">{groupDocs.length} document{groupDocs.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {group && (
                        <Link
                          href={`/admin/groups/${group.id}/edit`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Edit Group
                        </Link>
                      )}
                      {isCollapsed ? (
                        <ChevronRight size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Documents List */}
                  {!isCollapsed && (
                    <div>
                      {groupDocs.map((doc, index) => (
                        <div
                          key={doc.id}
                          className={`flex items-center justify-between p-5 hover:bg-gray-50 transition-colors ${
                            index !== groupDocs.length - 1 ? 'border-b border-gray-100' : ''
                          }`}
                        >
                          <Link href={`/docs/${doc.slug}`} className="flex-1 min-w-0 group">
                            <div className="flex items-center gap-4">
                              <div className="p-2.5 bg-gray-100 rounded-xl group-hover:bg-blue-100 transition-colors">
                                <FileText size={20} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                  {doc.title}
                                </h3>
                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {new Date(doc.updated_at).toLocaleDateString('vi-VN')}
                                  </span>
                                  {doc.description && (
                                    <>
                                      <span>•</span>
                                      <span className="truncate">{doc.description}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>

                          <div className="flex items-center gap-2 ml-4">
                            <Link
                              href={`/docs/${doc.slug}`}
                              target="_blank"
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                              <ExternalLink size={18} />
                            </Link>
                            <button
                              onClick={() => handleDelete(doc.id, doc.title)}
                              disabled={deleteId === doc.id}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ← View Public Site
          </Link>
        </div>
      </main>
    </div>
  );
}
