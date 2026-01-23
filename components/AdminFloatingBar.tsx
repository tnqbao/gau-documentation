'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import {
  Edit3,
  Save,
  X,
  LogOut,
  FileText,
  Plus,
  MoreHorizontal,
  Home
} from 'lucide-react';

interface AdminFloatingBarProps {
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  saving?: boolean;
  documentTitle?: string;
}

export default function AdminFloatingBar({
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  saving = false,
  documentTitle
}: AdminFloatingBarProps) {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {onEdit && !isEditing && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300 transition-all"
          >
            <Edit3 size={18} />
            <span className="font-medium">Edit</span>
          </button>
        )}

        {isEditing && (
          <div className="flex items-center gap-2 bg-white rounded-full shadow-lg border border-gray-200 p-1">
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2.5 bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300 transition-all"
          >
            <MoreHorizontal size={20} />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 py-2 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Logged in as</p>
                  <p className="font-semibold text-gray-900 mt-1">{session?.user?.name}</p>
                </div>

                <div className="py-2">
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <Home size={18} className="text-gray-400" />
                    <span>Home</span>
                  </Link>

                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <FileText size={18} className="text-gray-400" />
                    <span>All Documents</span>
                  </Link>

                  <Link
                    href="/admin/documents/new"
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <Plus size={18} className="text-gray-400" />
                    <span>New Document</span>
                  </Link>
                </div>

                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 w-full transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">Editing Mode</span>
            </div>
            {documentTitle && (
              <>
                <div className="w-px h-4 bg-gray-600" />
                <span className="text-sm text-gray-300">{documentTitle}</span>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

