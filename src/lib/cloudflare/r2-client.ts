import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize R2 client
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'ea644c4a47a499ad4721449cbac587f4';
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = 'style-swipe';

// R2 public URL base
const R2_PUBLIC_URL = 'https://pub-140b3d87a1b64af6a3193ba8aa685e26.r2.dev';

// Check if credentials are properly configured (32 chars for key ID, 64 for secret)
const isR2Configured = R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && 
  R2_ACCESS_KEY_ID.length === 32 && 
  R2_SECRET_ACCESS_KEY.length === 64;

export const r2Client = isR2Configured ? new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
}) : null;

export async function uploadToR2(
  buffer: ArrayBuffer,
  key: string,
  contentType: string = 'image/png'
): Promise<string> {
  if (!r2Client) {

    throw new Error('R2 credentials not properly configured');
  }

  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: contentType,
    });

    await r2Client.send(command);

    // Return the public URL
    return `${R2_PUBLIC_URL}/${key}`;
  } catch (error) {

    throw error;
  }
}

export async function uploadGeneratedOutfit(
  imageBuffer: ArrayBuffer,
  outfit: {
    occasion: string;
    tieColor: string;
    suitColor: string;
    shirtColor: string;
    tieStyle: string;
    season?: string;
  }
): Promise<string> {
  // Create a structured filename
  const timestamp = Date.now();
  const seasonPrefix = outfit.season ? `${outfit.season}-` : '';
  const filename = `${outfit.occasion}/${seasonPrefix}${outfit.tieColor}-${outfit.suitColor}-${outfit.tieStyle}-${timestamp}.png`;

  return uploadToR2(imageBuffer, filename);
}