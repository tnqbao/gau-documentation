import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const STORAGE_API_URL = process.env.STORAGE_API_URL || 'https://api.gauas.online';
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY || '';
const STORAGE_SECRET_KEY = process.env.STORAGE_SECRET_KEY || '';
const STORAGE_BUCKET_ID = process.env.STORAGE_BUCKET_ID || '';

function generateSignature(method: string, path: string, timestamp: number, body: Buffer | string): string {
  const bodyHash = crypto.createHash('sha256').update(body).digest('hex');
  const stringToSign = `${method}\n${path}\n${timestamp}\n${bodyHash}`;
  const signature = crypto.createHmac('sha256', STORAGE_SECRET_KEY).update(stringToSign).digest('hex');
  return signature;
}

function hashFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomStr = crypto.randomBytes(8).toString('hex');
  const ext = originalName.split('.').pop() || 'jpg';
  const hash = crypto.createHash('md5').update(`${originalName}${timestamp}${randomStr}`).digest('hex');
  return `${hash}.${ext}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const path = formData.get('path') as string || 'documents';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Hash file name
    const hashedFileName = hashFileName(file.name);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Prepare upload to Object Storage
    const uploadPath = `/api/v1/cloud/buckets/${STORAGE_BUCKET_ID}/objects`;
    const timestamp = Math.floor(Date.now() / 1000);

    // Create FormData for upload
    const uploadFormData = new FormData();
    const blob = new Blob([buffer], { type: file.type });
    uploadFormData.append('file', blob, hashedFileName);
    uploadFormData.append('path', path);

    // For multipart form data, we need to calculate signature differently
    // Using empty body hash for multipart requests
    const emptyHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    const stringToSign = `POST\n${uploadPath}\n${timestamp}\n${emptyHash}`;
    const signature = crypto.createHmac('sha256', STORAGE_SECRET_KEY).update(stringToSign).digest('hex');

    // Upload to Object Storage API
    const response = await fetch(`${STORAGE_API_URL}${uploadPath}`, {
      method: 'POST',
      headers: {
        'Authorization': `HMAC ${STORAGE_ACCESS_KEY}:${signature}`,
        'X-Timestamp': timestamp.toString(),
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', errorText);
      return NextResponse.json({ error: 'Upload failed', details: errorText }, { status: response.status });
    }

    const result = await response.json();

    // Construct the public URL for the uploaded image
    const imageUrl = `${STORAGE_API_URL}/api/v1/cloud/buckets/${STORAGE_BUCKET_ID}/objects/${path}/${hashedFileName}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      object: result.object,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

