import multer from 'multer';

// Keep files in memory so we can validate magic bytes then stream to Cloudinary.
const storage = multer.memoryStorage();

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    // First-pass filter on declared MIME. Real validation (magic bytes) happens in the controller.
    if (ALLOWED.has(file.mimetype)) return cb(null, true);
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files are allowed'));
  },
});
