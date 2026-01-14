const allowedExtensions = ['.log', '.txt', '.json'];

function validateFile(req, res, next) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'A log file is required.' });
  }

  const extension = (file.originalname.match(/\.[^.]+$/) || [''])[0].toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return res.status(400).json({ error: `Unsupported file type: ${extension}` });
  }

  if (file.size > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'File exceeds 5MB limit.' });
  }

  return next();
}

module.exports = {
  validateFile,
};

