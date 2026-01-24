import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllGroups, createGroup } from '@/lib/db';

export async function GET() {
  try {
    const groups = getAllGroups();
    return NextResponse.json(groups);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug, title, thumbnail, description } = await request.json();
    if (!slug || !title) {
      return NextResponse.json({ error: 'Slug and title are required' }, { status: 400 });
    }

    const group = createGroup(slug, title, thumbnail || null, description || null);
    return NextResponse.json(group, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}
