import multer from 'multer';

// 404 for unmatched routes
export function notFound(_req, res) {
  res.status(404).json({ error: 'Not found' });
}

// Central error handler. Keeps messages generic to avoid leaking internals.
export function errorHandler(err, _req, res, _next) {
  if (err instanceof multer.MulterError) {
    const msg =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File too large (max 10MB)'
        : err.field || 'Invalid upload';
    return res.status(400).json({ error: msg });
  }
  // Mongoose validation
  if (err?.name === 'ValidationError') {
    return res.status(400).json({ error: 'Invalid input' });
  }
  console.error('[error]', err);
  res.status(err.status || 500).json({ error: err.publicMessage || 'Server error' });
}
