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

export function getAdjacentDocuments(currentSlug: string): { prev: Document | null; next: Document | null } {
  const all = getAllDocuments();
  const currentIndex = all.findIndex(doc => doc.slug === currentSlug);

  return {
    prev: currentIndex > 0 ? all[currentIndex - 1] : null,
    next: currentIndex < all.length - 1 ? all[currentIndex + 1] : null,
  };
}

export function getDocumentsByPath(): Record<string, Document[]> {
  const docs = getAllDocuments();
  const grouped: Record<string, Document[]> = {};

  docs.forEach(doc => {
    const pathParts = doc.slug.split('/');
    const basePath = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : '/';

    if (!grouped[basePath]) {
      grouped[basePath] = [];
    }
    grouped[basePath].push(doc);
  });

  return grouped;
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
