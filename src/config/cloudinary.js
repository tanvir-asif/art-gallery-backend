import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload an in-memory image buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {string} folder
 * @returns {Promise<{secure_url:string, public_id:string, width:number, height:number}>}
 */
export function uploadBuffer(buffer, folder = 'gallery') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export function deleteByPublicId(publicId) {
  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}

export default cloudinary;
