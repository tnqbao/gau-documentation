'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === 'admin';

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-900">Gauas Document</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            {isAdmin && (
              <>
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Admin
                </Link>
                <Link
                  href="/admin/homepage"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Edit Homepage
                </Link>
              </>
            )}
            {!session ? (
              <Link
                href="/admin/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            ) : (
              <Link
                href="/api/auth/signout"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign Out
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
