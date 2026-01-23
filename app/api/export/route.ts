import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'docs.db');
    const fileBuffer = await readFile(dbPath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/x-sqlite3',
        'Content-Disposition': `attachment; filename="docs.db"`,
      },
    });
  } catch (error) {
    console.error('Error exporting database:', error);
    return NextResponse.json(
      { error: 'Failed to export database' },
      { status: 500 }
    );
  }
}

