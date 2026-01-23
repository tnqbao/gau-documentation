import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const STORAGE_API_URL = process.env.STORAGE_API_URL || 'https://api.gauas.online';
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY || '';
const STORAGE_SECRET_KEY = process.env.STORAGE_SECRET_KEY || '';
const STORAGE_BUCKET_ID = process.env.STORAGE_BUCKET_ID || '';

function hashFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomStr = crypto.randomBytes(8).toString('hex');
  const ext = originalName.split('.').pop() || 'jpg';
  const hash = crypto.createHash('md5').update(`${originalName}${timestamp}${randomStr}`).digest('hex');
  return `${hash}.${ext}`;
}

function generateHMACSignature(method: string, path: string, timestamp: number, bodyHash: string, secretKey: string): string {
  const stringToSign = `${method}\n${path}\n${timestamp}\n${bodyHash}`;
  const signature = crypto.createHmac('sha256', secretKey).update(stringToSign).digest('hex');
  return signature;
}

// Build multipart form data manually to get the exact body bytes
function buildMultipartFormData(file: Buffer, fileName: string, fileType: string, folderPath: string): { body: Buffer; boundary: string } {
  const boundary = `----FormBoundary${crypto.randomBytes(16).toString('hex')}`;

  const parts: Buffer[] = [];

  // File part
  const fileHeader = Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n` +
    `Content-Type: ${fileType}\r\n\r\n`
  );
  parts.push(fileHeader);
  parts.push(file);
  parts.push(Buffer.from('\r\n'));

  // Path part
  const pathPart = Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="path"\r\n\r\n` +
    `${folderPath}\r\n`
  );
  parts.push(pathPart);

  // End boundary
  parts.push(Buffer.from(`--${boundary}--\r\n`));

  const body = Buffer.concat(parts);

  return { body, boundary };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folderPath = 'images';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const hashedFileName = hashFileName(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { body: multipartBody, boundary } = buildMultipartFormData(
      buffer,
      hashedFileName,
      file.type || 'application/octet-stream',
      folderPath
    );

    const uploadPath = `/api/v1/cloud/buckets/${STORAGE_BUCKET_ID}/objects`;
    const timestamp = Math.floor(Date.now() / 1000);
    const bodyHash = crypto.createHash('sha256').update(multipartBody).digest('hex');
    const signature = generateHMACSignature('POST', uploadPath, timestamp, bodyHash, STORAGE_SECRET_KEY);
    const authHeader = `HMAC ${STORAGE_ACCESS_KEY}:${signature}`;

    // Convert Buffer to Uint8Array for fetch body
    const response = await fetch(`${STORAGE_API_URL}${uploadPath}`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'X-Timestamp': String(timestamp),
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: new Uint8Array(multipartBody),
    });

    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json({ error: 'Upload failed', details: responseText }, { status: response.status });
    }

    const result = JSON.parse(responseText);
    const imageUrl = `https://cdn.gauas.online/media/${folderPath}/${hashedFileName}`;

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
