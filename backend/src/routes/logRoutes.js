const express = require('express');
const multer = require('multer');
const { uploadLog, fetchLogs, fetchLogById } = require('../controllers/logController');
const { validateFile } = require('../middlewares/fileValidation');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', fetchLogs);
router.get('/:id', fetchLogById);
router.post('/', upload.single('file'), validateFile, uploadLog);

module.exports = router;

