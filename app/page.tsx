import Link from 'next/link';
import { FileText, Settings, PenLine, Shield, Zap, ChevronRight, Folder, ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { getAllExternalLinks, getAllDocuments } from '@/lib/db';
import Image from 'next/image';

// Force dynamic rendering - always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  const externalLinks = getAllExternalLinks();
  const allDocuments = getAllDocuments();

  // Debug: log để kiểm tra
  console.log('External Links:', externalLinks.map(l => ({ id: l.id, title: l.title, url: l.url })));
  console.log('All documents:', allDocuments.map(d => ({ title: d.title, group_id: d.group_id })));

  return (
    <div className="min-h-screen bg-white">
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

      {/* External Links Section */}
      {externalLinks.length > 0 && (
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Our Products
              </h2>
              <p className="text-lg text-gray-600">
                All our platforms and tools in one place
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {externalLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-start gap-3 p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  {link.thumbnail ? (
                    <div className="w-full h-40 bg-gray-100 rounded-md overflow-hidden mb-2">
                      <Image src={link.thumbnail} alt={link.title} width={800} height={400} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gray-100 rounded-md mb-2 flex items-center justify-center text-gray-400">
                      <ExternalLinkIcon size={48} />
                    </div>
                  )}

                  <div className="w-full flex-1">
                    <div className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{link.title}</div>
                    {link.description && (
                      <p className="text-sm text-gray-600 line-clamp-3">{link.description}</p>
                    )}
                  </div>

                  <div className="mt-auto w-full flex justify-between items-center">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <ExternalLinkIcon size={12} />
                      External Link
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </a>
              ))}
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
    </div>
  );
}
