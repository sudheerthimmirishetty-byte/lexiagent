const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  getDocuments,
  getDocumentById,
  analyzeDocument,
  deleteDocument,
} = require('../controllers/document.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { aiRateLimiter } = require('../middleware/rateLimiter');

router.use(protect);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.post('/:id/analyze', aiRateLimiter, analyzeDocument);
router.delete('/:id', deleteDocument);

module.exports = router;
