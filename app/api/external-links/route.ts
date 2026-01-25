import { NextResponse, NextRequest } from 'next/server';
import { getAllExternalLinks, createExternalLink } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const links = getAllExternalLinks();
    return NextResponse.json(links);
  } catch (error) {
    console.error('Failed to fetch external links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch external links' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { title, description, url, thumbnail, order_index } = data;

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      );
    }

    const newLink = createExternalLink({
      title,
      description: description || null,
      url,
      thumbnail: thumbnail || null,
      order_index: order_index || 0
    });

    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    console.error('Failed to create external link:', error);
    return NextResponse.json(
      { error: 'Failed to create external link' },
      { status: 500 }
    );
  }
}
