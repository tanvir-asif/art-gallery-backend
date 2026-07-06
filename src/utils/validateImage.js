import { fileTypeFromBuffer } from 'file-type';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

/**
 * Verify a buffer is genuinely an image by inspecting its magic bytes,
 * not just the client-supplied extension / MIME.
 * @returns {Promise<{ok:true, mime:string} | {ok:false, reason:string}>}
 */
export async function verifyImageBuffer(buffer) {
  if (!buffer || buffer.length === 0) return { ok: false, reason: 'Empty file' };
  const type = await fileTypeFromBuffer(buffer);
  if (!type) return { ok: false, reason: 'Unrecognized file type' };
  if (!ALLOWED_MIME.has(type.mime)) {
    return { ok: false, reason: `Unsupported image type: ${type.mime}` };
  }
  return { ok: true, mime: type.mime };
}
