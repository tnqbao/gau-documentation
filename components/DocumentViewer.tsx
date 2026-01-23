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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors">
              <Image src="/logo.svg" alt="Logo" width={24} height={24} className="w-6 h-6" />
              <span className="font-semibold text-lg">Gauas Document</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Admin
                </Link>
              )}
            </nav>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 py-3 text-sm overflow-x-auto">
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
        </div>
      </header>

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-12 max-w-7xl">
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              <p>Created by <span className="font-semibold text-gray-900">tnqbao</span></p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/tnqbao"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                github.com/tnqbao
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              {new Date().getFullYear()} Documentation System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
