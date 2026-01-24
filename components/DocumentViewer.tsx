'use client';

import { Document } from '@/lib/db';
import { useSession } from 'next-auth/react';
import { useState, useCallback } from 'react';
import { Edit, Save, X, ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import NotionEditor from './NotionEditor';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface DocumentViewerProps {
  document: Document;
  htmlContent: string;
  adjacentDocs?: {
    prev: Document | null;
    next: Document | null;
  };
}

export default function DocumentViewer({ document, htmlContent: initialHtmlContent, adjacentDocs }: DocumentViewerProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(document.title);
  const [description, setDescription] = useState(document.description || '');
  const [content, setContent] = useState(document.content_md);
  const [displayHtml, setDisplayHtml] = useState(initialHtmlContent);
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin = session?.user?.email === 'admin';

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          description: description,
          content_md: content,
          slug: document.slug,
        }),
      });

      if (response.ok) {
        // Cập nhật HTML hiển thị trực tiếp từ content đã edit (là HTML từ Tiptap)
        setDisplayHtml(content);
        setIsEditing(false);
        // Refresh router cache để lần sau load đúng data
        router.refresh();
      } else {
        alert('Failed to save document');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving document');
    } finally {
      setIsSaving(false);
    }
  }, [title, description, content, document, router]);

  const handleCancel = () => {
    setTitle(document.title);
    setDescription(document.description || '');
    setContent(document.content_md);
    setIsEditing(false);
  };

  const breadcrumbs = document.slug.split('/').filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Floating Action Buttons */}
      {isAdmin && (
        <div className="fixed top-20 right-4 z-50 flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white text-sm sm:text-base rounded-xl shadow-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white text-sm sm:text-base rounded-xl shadow-lg hover:bg-gray-700 transition-colors"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Cancel</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-4xl py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm overflow-x-auto">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight size={14} className="text-gray-400" />
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 font-medium">{crumb}</span>
                ) : (
                  <Link
                    href={`/docs/${breadcrumbs.slice(0, index + 1).join('/')}`}
                    className="text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {crumb}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Document Header with Title and Description */}
          <div className="mb-6">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-3xl sm:text-4xl font-bold text-gray-900 w-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1 mb-2"
                  placeholder="Document title"
                />
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-lg text-gray-600 w-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
                  placeholder="Add a description..."
                />
              </>
            ) : (
              <>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
                {description && (
                  <p className="text-lg text-gray-600">{description}</p>
                )}
              </>
            )}
          </div>

          {/* Document Metadata */}
          <div className="mb-6 flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              <span>Created: {new Date(document.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} />
              <span>Last updated: {new Date(document.updated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>

          {/* Document Content */}
          <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {isEditing ? (
              <NotionEditor
                content={content}
                onChange={setContent}
                editable={true}
              />
            ) : (
              <div
                className="prose prose-base sm:prose-lg max-w-none
                  p-6 sm:p-8
                  prose-headings:font-bold prose-headings:text-gray-900 prose-headings:scroll-mt-20
                  prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:mb-6
                  prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl prose-img:max-w-full prose-img:h-auto prose-img:shadow-md
                  prose-pre:bg-gray-900 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:text-sm prose-pre:p-4
                  prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                  prose-ul:my-4 prose-ol:my-4 prose-li:my-1
                  prose-table:w-full prose-table:overflow-x-auto prose-table:block prose-table:max-w-full
                  prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left
                  prose-td:p-3 prose-td:border-t prose-td:border-gray-200
                  prose-hr:my-8 prose-hr:border-gray-200"
                dangerouslySetInnerHTML={{ __html: displayHtml }}
              />
            )}
          </article>

          {/* Navigation between documents */}
          {adjacentDocs && (adjacentDocs.prev || adjacentDocs.next) && (
            <div className="mt-12 grid grid-cols-2 gap-4">
              {adjacentDocs.prev ? (
                <Link
                  href={`/docs/${adjacentDocs.prev.slug}`}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <ChevronLeft size={20} className="text-gray-400 group-hover:text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">Previous</div>
                    <div className="font-medium text-gray-900 group-hover:text-blue-600 truncate">
                      {adjacentDocs.prev.title}
                    </div>
                  </div>
                </Link>
              ) : (
                <div></div>
              )}

              {adjacentDocs.next ? (
                <Link
                  href={`/docs/${adjacentDocs.next.slug}`}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group text-right"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">Next</div>
                    <div className="font-medium text-gray-900 group-hover:text-blue-600 truncate">
                      {adjacentDocs.next.title}
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600" />
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
