'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import AdminToolbar from '@/components/AdminToolbar';
import EditorSidebar from '@/components/EditorSidebar';
import InlineEditor from '@/components/InlineEditor';

interface Document {
  id: number;
  slug: string;
  title: string;
  content_md: string;
  created_at: string;
  updated_at: string;
}

interface DocumentPageClientProps {
  document: Document;
  htmlContent: string;
}

export default function DocumentPageClient({ document, htmlContent }: DocumentPageClientProps) {
  const { status } = useSession();
  const isAdmin = status === 'authenticated';

  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content_md);
  const [saving, setSaving] = useState(false);
  const [previewHtml, setPreviewHtml] = useState(htmlContent);

  const handleEdit = () => {
    setIsEditing(true);
    setSidebarOpen(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSidebarOpen(false);
    setTitle(document.title);
    setContent(document.content_md);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/documents/${document.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: document.slug,
          content_md: content
        })
      });

      if (res.ok) {
        // Refresh page để lấy HTML mới
        window.location.reload();
      } else {
        alert('Failed to save document');
      }
    } catch (error) {
      alert('Error saving document');
    } finally {
      setSaving(false);
    }
  };

  const handleInsert = (markdown: string) => {
    setContent(prev => prev + markdown);
  };

  const handleWrap = (before: string, after: string) => {
    setContent(prev => prev + before + 'text' + after);
  };

  return (
    <div className={`min-h-screen bg-white ${isEditing && sidebarOpen ? 'ml-64' : ''} transition-all duration-300`}>
      {/* Admin Toolbar */}
      {isAdmin && (
        <AdminToolbar
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
        />
      )}

      {/* Editor Sidebar */}
      {isAdmin && isEditing && (
        <EditorSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onInsert={handleInsert}
          onWrap={handleWrap}
        />
      )}

      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <header className="mb-8">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-4xl font-bold text-gray-900 w-full border-2 border-blue-300 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
            />
          ) : (
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{document.title}</h1>
          )}
          <p className="text-gray-500 text-sm mt-2">
            Last updated: {new Date(document.updated_at).toLocaleDateString('vi-VN')}
          </p>
        </header>

        {/* Content */}
        {isEditing ? (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                📝 <strong>Editing Mode:</strong> Use the sidebar tools to format your content.
                Write in Markdown format.
              </p>
            </div>
            <InlineEditor
              content={content}
              onChange={setContent}
              isEditing={isEditing}
            />
          </div>
        ) : (
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </article>
    </div>
  );
}
'use client';

import { useRef, useEffect } from 'react';

interface InlineEditorProps {
  content: string;
  onChange: (content: string) => void;
  isEditing: boolean;
}

export default function InlineEditor({ content, onChange, isEditing }: InlineEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  if (!isEditing) {
    return null;
  }

  return (
    <textarea
      ref={textareaRef}
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-h-[500px] p-4 border-2 border-blue-300 rounded-lg font-mono text-sm bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
      placeholder="Write your markdown content here..."
    />
  );
}

// Hook để chèn và wrap text
export function useEditorActions(
  content: string,
  setContent: (content: string) => void,
  textareaRef?: React.RefObject<HTMLTextAreaElement>
) {
  const insertText = (text: string) => {
    setContent(content + text);
  };

  const wrapSelection = (before: string, after: string) => {
    // Thêm wrapper vào cuối nếu không có selection
    setContent(content + before + 'text' + after);
  };

  return { insertText, wrapSelection };
}

