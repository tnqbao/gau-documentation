import Link from 'next/link';
import { FileText, Settings, PenLine, Shield, Zap, ChevronRight, Folder } from 'lucide-react';
import { getAllGroups, getDocumentsByGroupId, getAllDocuments } from '@/lib/db';
import Image from 'next/image';

export default function HomePage() {
  const groups = getAllGroups();
  const allDocuments = getAllDocuments();

  // Debug: log để kiểm tra
  console.log('Groups:', groups.map(g => ({ id: g.id, title: g.title })));
  console.log('All documents:', allDocuments.map(d => ({ title: d.title, group_id: d.group_id })));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-900">Gauas Document</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/docs/getting-started"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Documentation
              </Link>
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin
              </Link>
              <Link
                href="/admin/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Documentation made
              <span className="text-blue-600"> simple</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              A modern documentation platform with intuitive editing experience.
              Create, manage, and publish your documentation with ease.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/docs/getting-started"
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors text-center"
              >
                Get Started
              </Link>
              <Link
                href="/admin/documents/new"
                className="w-full sm:w-auto px-8 py-3 bg-gray-100 text-gray-900 font-medium rounded-xl hover:bg-gray-200 transition-colors text-center"
              >
                Create Document
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Groups Section */}
      {groups.length > 0 && (
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Browse Documentation Groups
              </h2>
              <p className="text-lg text-gray-600">
                Explore documentation categories
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map(group => {
                const docs = getDocumentsByGroupId(group.id);
                return (
                  <Link
                    key={group.id}
                    href={`/docs/${group.slug}`}
                    className="flex flex-col items-start gap-3 p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
                  >
                    {group.thumbnail ? (
                      <div className="w-full h-40 bg-gray-100 rounded-md overflow-hidden mb-2">
                        <Image src={group.thumbnail} alt={group.title} width={800} height={400} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-gray-100 rounded-md mb-2 flex items-center justify-center text-gray-400">No image</div>
                    )}

                    <div className="w-full">
                      <div className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors truncate">{group.title}</div>
                      <div className="text-sm text-gray-500 mt-1">{docs.length} page{docs.length !== 1 ? 's' : ''}</div>
                    </div>

                    <div className="mt-auto w-full text-right">
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features to help you create and manage documentation
              efficiently.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Rich Text Editor
              </h3>
              <p className="text-gray-600 leading-relaxed">
                WYSIWYG editor with support for headings, lists, tables, code
                blocks, and more.
              </p>
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <PenLine className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Inline Editing
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Edit any page directly without leaving the view. Changes are saved
                instantly.
              </p>
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast Performance
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Built with Next.js for optimal performance and SEO optimization.
              </p>
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Access
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Role-based authentication to control who can view and edit content.
              </p>
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Intuitive admin panel to organize and manage all your documents.
              </p>
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Responsive Design
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Looks great on any device - desktop, tablet, or mobile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Start creating beautiful documentation today.
            </p>
            <Link
              href="/admin/documents/new"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-medium rounded-2xl hover:bg-blue-700 transition-colors"
            >
              <PenLine className="w-5 h-5" />
              Create Your First Document
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Gau Documentation</span>
            </div>
            <p className="text-gray-500 text-sm">
              Built with Next.js and Tiptap
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
