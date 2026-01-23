import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllDocuments, createDocument, getAllGroups } from '@/lib/db';

// GET /api/documents - Lấy danh sách documents với thông tin group
export async function GET() {
  try {
    const documents = getAllDocuments();
    const groups = getAllGroups();

    // Tạo map để nhanh chóng tra cứu group theo id
    const groupMap = new Map(groups.map(g => [g.id, g]));

    // Thêm thông tin group vào mỗi document
    const documentsWithGroups = documents.map(doc => ({
      ...doc,
      group: doc.group_id ? groupMap.get(doc.group_id) : null
    }));

    return NextResponse.json(documentsWithGroups);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST /api/documents - Tạo document mới (cần auth)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug, title, description, content_md, group_id } = await request.json();

    if (!slug || !title) {
      return NextResponse.json({ error: 'Slug and title are required' }, { status: 400 });
    }

    const document = createDocument(slug, title, content_md || '', group_id ?? null, description ?? null);
    return NextResponse.json(document, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint')) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}
