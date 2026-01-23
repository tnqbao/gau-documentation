import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getGroupById, updateGroup, deleteGroup } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const group = getGroupById(parseInt(id));
    if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    return NextResponse.json(group);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch group' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const { slug, title, thumbnail } = await request.json();
    if (!slug || !title) return NextResponse.json({ error: 'Slug and title required' }, { status: 400 });
    const g = updateGroup(parseInt(id), slug, title, thumbnail || null);
    if (!g) return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    return NextResponse.json(g);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update group' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const ok = deleteGroup(parseInt(id));
    if (!ok) return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 });
  }
}

