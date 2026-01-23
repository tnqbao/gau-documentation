import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getAdminByUsername, createAdmin, adminExists } from './db';

// Tạo admin mặc định nếu chưa có
async function ensureDefaultAdmin() {
  if (!adminExists()) {
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = await bcrypt.hash(defaultPassword, 10);
    createAdmin('admin', hash);
    console.log('Default admin created. Username: admin, Password:', defaultPassword);
  }
}

// Gọi khi module được load
ensureDefaultAdmin();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const admin = getAdminByUsername(credentials.username);
        if (!admin) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, admin.password_hash);
        if (!isValid) {
          return null;
        }

        return {
          id: String(admin.id),
          name: admin.username,
          email: admin.username
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  pages: {
    signIn: '/admin/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
};
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Đảm bảo thư mục data tồn tại
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'docs.db');
const db = new Database(dbPath);

// Khởi tạo schema
db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content_md TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Tạo admin table
db.exec(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  )
`);

export interface Document {
  id: number;
  slug: string;
  title: string;
  content_md: string;
  created_at: string;
  updated_at: string;
}

// Document operations
export function getAllDocuments(): Document[] {
  return db.prepare('SELECT * FROM documents ORDER BY updated_at DESC').all() as Document[];
}

export function getDocumentBySlug(slug: string): Document | undefined {
  return db.prepare('SELECT * FROM documents WHERE slug = ?').get(slug) as Document | undefined;
}

export function getDocumentById(id: number): Document | undefined {
  return db.prepare('SELECT * FROM documents WHERE id = ?').get(id) as Document | undefined;
}

export function createDocument(slug: string, title: string, content_md: string): Document {
  const stmt = db.prepare(`
    INSERT INTO documents (slug, title, content_md, created_at, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);
  const result = stmt.run(slug, title, content_md);
  return getDocumentById(result.lastInsertRowid as number)!;
}

export function updateDocument(id: number, slug: string, title: string, content_md: string): Document | undefined {
  const stmt = db.prepare(`
    UPDATE documents 
    SET slug = ?, title = ?, content_md = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(slug, title, content_md, id);
  return getDocumentById(id);
}

export function deleteDocument(id: number): boolean {
  const stmt = db.prepare('DELETE FROM documents WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

// Admin operations
export function getAdminByUsername(username: string) {
  return db.prepare('SELECT * FROM admin WHERE username = ?').get(username) as { id: number; username: string; password_hash: string } | undefined;
}

export function createAdmin(username: string, passwordHash: string) {
  const stmt = db.prepare('INSERT INTO admin (username, password_hash) VALUES (?, ?)');
  return stmt.run(username, passwordHash);
}

export function adminExists(): boolean {
  const result = db.prepare('SELECT COUNT(*) as count FROM admin').get() as { count: number };
  return result.count > 0;
}

export default db;

