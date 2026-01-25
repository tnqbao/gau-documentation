import { NextResponse, NextRequest } from 'next/server';
import { getExternalLinkById, updateExternalLink, deleteExternalLink } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid link ID' },
        { status: 400 }
      );
    }

    const link = getExternalLinkById(id);
    if (!link) {
      return NextResponse.json(
        { error: 'External link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(link);
  } catch (error) {
    console.error('Failed to fetch external link:', error);
    return NextResponse.json(
      { error: 'Failed to fetch external link' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid link ID' },
        { status: 400 }
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

    const updatedLink = updateExternalLink(id, {
      title,
      description,
      url,
      thumbnail,
      order_index
    });

    if (!updatedLink) {
      return NextResponse.json(
        { error: 'External link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedLink);
  } catch (error) {
    console.error('Failed to update external link:', error);
    return NextResponse.json(
      { error: 'Failed to update external link' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid link ID' },
        { status: 400 }
      );
    }

    const deleted = deleteExternalLink(id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'External link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete external link:', error);
    return NextResponse.json(
      { error: 'Failed to delete external link' },
      { status: 500 }
    );
  }
}
