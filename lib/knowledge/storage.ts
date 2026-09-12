// ============================================================================
// lib/knowledge/storage.ts
// Keep the original file of an uploaded PDF. Cloud Run has no disk, so the
// bytes go to a GCS bucket named by KNOWLEDGE_BUCKET; the text is extracted
// at upload time and lives in the database regardless, so a missing bucket
// only means the original is not retained — ingestion still works.
// ============================================================================
import { Storage } from '@google-cloud/storage';

const bucketName = process.env.KNOWLEDGE_BUCKET;
let storage: Storage | null = null;

export function storageConfigured(): boolean {
  return !!bucketName;
}

export async function putObject(path: string, bytes: Uint8Array, contentType: string): Promise<string | null> {
  if (!bucketName) return null;
  storage ??= new Storage();
  try {
    await storage.bucket(bucketName).file(path).save(Buffer.from(bytes), { contentType, resumable: false });
    return path;
  } catch (e) {
    console.error('knowledge/storage: upload failed', path, e instanceof Error ? e.message : e);
    return null;
  }
}

export async function getObject(path: string): Promise<Buffer | null> {
  if (!bucketName) return null;
  storage ??= new Storage();
  try {
    const [buf] = await storage.bucket(bucketName).file(path).download();
    return buf;
  } catch (e) {
    console.error('knowledge/storage: download failed', path, e instanceof Error ? e.message : e);
    return null;
  }
}
