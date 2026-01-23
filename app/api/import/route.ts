import { NextRequest, NextResponse } from 'next/server';
import { writeFile, rename, unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.db') && !fileName.endsWith('.sqlite') && !fileName.endsWith('.sqlite3')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a SQLite database file (.db, .sqlite, .sqlite3)' },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check if it's a valid SQLite file (magic header)
    const sqliteHeader = 'SQLite format 3';
    const fileHeader = buffer.slice(0, 15).toString('utf-8');
    if (!fileHeader.startsWith(sqliteHeader)) {
      return NextResponse.json(
        { error: 'Invalid SQLite database file' },
        { status: 400 }
      );
    }

    const dbDir = path.join(process.cwd(), 'data');
    const dbPath = path.join(dbDir, 'docs.db');
    const backupPath = path.join(dbDir, `docs.backup.${Date.now()}.db`);
    const tempPath = path.join(dbDir, 'docs.temp.db');

    // Create backup of existing database
    if (existsSync(dbPath)) {
      await rename(dbPath, backupPath);
    }

    try {
      // Write uploaded file to temp location
      await writeFile(tempPath, buffer);

      // Rename temp file to actual database file
      await rename(tempPath, dbPath);

      // Delete backup after successful import
      if (existsSync(backupPath)) {
        await unlink(backupPath);
      }

      return NextResponse.json({
        success: true,
        message: 'Database imported successfully'
      });
    } catch (error) {
      // Restore backup if import fails
      if (existsSync(backupPath)) {
        await rename(backupPath, dbPath);
      }
      // Clean up temp file if it exists
      if (existsSync(tempPath)) {
        await unlink(tempPath);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error importing database:', error);
    return NextResponse.json(
      { error: 'Failed to import database: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

