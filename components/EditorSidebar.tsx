'use client';

import { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image,
  Code,
  Quote,
  Minus,
  Table,
  Undo,
  Redo,
  ChevronLeft,
  ChevronRight,
  Type
} from 'lucide-react';

interface EditorSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onInsert: (markdown: string) => void;
  onWrap: (before: string, after: string) => void;
}

export default function EditorSidebar({ isOpen, onToggle, onInsert, onWrap }: EditorSidebarProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);

  const tools = [
    { icon: Bold, label: 'Bold', action: () => onWrap('**', '**') },
    { icon: Italic, label: 'Italic', action: () => onWrap('*', '*') },
    { icon: Underline, label: 'Underline', action: () => onWrap('<u>', '</u>') },
    { icon: Code, label: 'Inline Code', action: () => onWrap('`', '`') },
    { divider: true },
    { icon: Heading1, label: 'Heading 1', action: () => onInsert('\n# ') },
    { icon: Heading2, label: 'Heading 2', action: () => onInsert('\n## ') },
    { icon: Heading3, label: 'Heading 3', action: () => onInsert('\n### ') },
    { divider: true },
    { icon: List, label: 'Bullet List', action: () => onInsert('\n- ') },
    { icon: ListOrdered, label: 'Numbered List', action: () => onInsert('\n1. ') },
    { icon: Quote, label: 'Blockquote', action: () => onInsert('\n> ') },
    { divider: true },
    { icon: LinkIcon, label: 'Link', action: () => setShowLinkInput(true) },
    { icon: Image, label: 'Image', action: () => setShowImageInput(true) },
    { icon: Minus, label: 'Horizontal Rule', action: () => onInsert('\n---\n') },
    { divider: true },
    {
      icon: Code,
      label: 'Code Block',
      action: () => onInsert('\n```\ncode here\n```\n')
    },
    {
      icon: Table,
      label: 'Table',
      action: () => onInsert('\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n')
    },
  ];

  const handleInsertImage = () => {
    if (imageUrl) {
      onInsert(`\n![Image](${imageUrl})\n`);
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  const handleInsertLink = () => {
    if (linkUrl) {
      onInsert(`[${linkText || 'Link'}](${linkUrl})`);
      setLinkUrl('');
      setLinkText('');
      setShowLinkInput(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed top-1/2 -translate-y-1/2 z-40 p-2 bg-blue-600 text-white rounded-r-lg shadow-lg hover:bg-blue-700 transition-all ${
          isOpen ? 'left-64' : 'left-0'
        }`}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-30 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Type size={20} />
            Editor Tools
          </h3>
          <p className="text-sm text-gray-500 mt-1">Format your content</p>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="space-y-1">
            {tools.map((tool, index) =>
              tool.divider ? (
                <hr key={index} className="my-3" />
              ) : (
                <button
                  key={index}
                  onClick={tool.action}
                  className="flex items-center gap-3 w-full px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  {tool.icon && <tool.icon size={18} />}
                  <span className="text-sm">{tool.label}</span>
                </button>
              )
            )}
          </div>

          {/* Image Input Modal */}
          {showImageInput && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Insert Image</h4>
              <input
                type="url"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleInsertImage}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  Insert
                </button>
                <button
                  onClick={() => setShowImageInput(false)}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Link Input Modal */}
          {showLinkInput && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Insert Link</h4>
              <input
                type="text"
                placeholder="Link text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
              />
              <input
                type="url"
                placeholder="URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleInsertLink}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  Insert
                </button>
                <button
                  onClick={() => setShowLinkInput(false)}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Tips</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Select text then click format</li>
              <li>• Use URL for images (no upload)</li>
              <li>• Click Save when done editing</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { Edit3, Save, X, LogOut, FileText, Plus, Menu } from 'lucide-react';

interface AdminToolbarProps {
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  saving?: boolean;
}

export default function AdminToolbar({
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  saving = false
}: AdminToolbarProps) {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {/* Edit/Save Buttons */}
      {onEdit && !isEditing && (
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Edit3 size={18} />
          <span>Edit</span>
        </button>
      )}

      {isEditing && (
        <>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 transition-colors"
          >
            <X size={18} />
            <span>Cancel</span>
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </>
      )}

      {/* Admin Menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-900 transition-colors"
        >
          <Menu size={18} />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-xl border z-50 py-2">
              <div className="px-4 py-2 border-b">
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="font-medium text-gray-900">{session.user?.name}</p>
              </div>

              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setShowMenu(false)}
              >
                <FileText size={18} />
                <span>All Documents</span>
              </Link>

              <Link
                href="/admin/documents/new"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setShowMenu(false)}
              >
                <Plus size={18} />
                <span>New Document</span>
              </Link>

              <hr className="my-2" />

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

