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
  CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    thumbnail TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content_md TEXT NOT NULL,
    group_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// If the table existed from before (without group_id), ensure the column exists
try {
  const docCols = db.prepare("PRAGMA table_info(documents)").all() as Array<{ name: string }>;
  const hasGroupId = docCols.some(c => c.name === 'group_id');
  if (!hasGroupId) {
    db.exec("ALTER TABLE documents ADD COLUMN group_id INTEGER");
  }
  const hasDescription = docCols.some(c => c.name === 'description');
  if (!hasDescription) {
    db.exec("ALTER TABLE documents ADD COLUMN description TEXT");
  }
} catch (e) {
  console.warn('Could not ensure group_id column exists:', e);
}

// If the groups table existed from before (without thumbnail), ensure the column exists
try {
  const cols = db.prepare("PRAGMA table_info(groups)").all() as Array<{ name: string }>;
  const hasThumb = cols.some(c => c.name === 'thumbnail');
  if (!hasThumb) {
    // If groups table exists but has no thumbnail column, try to add it
    db.exec("ALTER TABLE groups ADD COLUMN thumbnail TEXT");
  }
  const hasDescription = cols.some(c => c.name === 'description');
  if (!hasDescription) {
    db.exec("ALTER TABLE groups ADD COLUMN description TEXT");
  }
} catch (e) {
  // ignore
}

// Tạo admin table
db.exec(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  )
`);

export interface Group {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  content_md: string;
  group_id?: number | null;
  created_at: string;
  updated_at: string;
}

// Document operations
export function getAllDocuments(): Document[] {
  return db.prepare('SELECT * FROM documents ORDER BY updated_at DESC').all() as Document[];
}

export function getDocumentsByGroupId(groupId: number): Document[] {
  return db.prepare('SELECT * FROM documents WHERE group_id = ? ORDER BY updated_at DESC').all(groupId) as Document[];
}

export function getDocumentBySlug(slug: string): Document | undefined {
  return db.prepare('SELECT * FROM documents WHERE slug = ?').get(slug) as Document | undefined;
}

export function getDocumentById(id: number): Document | undefined {
  return db.prepare('SELECT * FROM documents WHERE id = ?').get(id) as Document | undefined;
}

export function createDocument(slug: string, title: string, content_md: string, group_id?: number | null, description?: string | null): Document {
  const stmt = db.prepare(`
    INSERT INTO documents (slug, title, description, content_md, group_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);
  const result = stmt.run(slug, title, description || null, content_md, group_id || null);
  return getDocumentById(result.lastInsertRowid as number)!;
}

export function updateDocument(id: number, slug: string, title: string, content_md: string, group_id?: number | null, description?: string | null): Document | undefined {
  const stmt = db.prepare(`
    UPDATE documents 
    SET slug = ?, title = ?, description = ?, content_md = ?, group_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(slug, title, description || null, content_md, group_id || null, id);
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

// Group operations
export function getAllGroups(): Group[] {
  return db.prepare('SELECT * FROM groups ORDER BY updated_at DESC').all() as Group[];
}

export function getGroupBySlug(slug: string): Group | undefined {
  return db.prepare('SELECT * FROM groups WHERE slug = ?').get(slug) as Group | undefined;
}

export function getGroupById(id: number): Group | undefined {
  return db.prepare('SELECT * FROM groups WHERE id = ?').get(id) as Group | undefined;
}

export function createGroup(slug: string, title: string, thumbnail?: string | null, description?: string | null): Group {
  const stmt = db.prepare(`
    INSERT INTO groups (slug, title, description, thumbnail, created_at, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);
  const result = stmt.run(slug, title, description || null, thumbnail || null);
  return getGroupById(result.lastInsertRowid as number)!;
}

export function updateGroup(id: number, slug: string, title: string, thumbnail?: string | null, description?: string | null): Group | undefined {
  const stmt = db.prepare(`
    UPDATE groups
    SET slug = ?, title = ?, description = ?, thumbnail = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(slug, title, description || null, thumbnail || null, id);
  return getGroupById(id);
}

export function deleteGroup(id: number): boolean {
  const stmt = db.prepare('DELETE FROM groups WHERE id = ?');
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
