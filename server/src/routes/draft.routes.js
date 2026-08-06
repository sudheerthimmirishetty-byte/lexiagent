const express = require('express');
const router = express.Router();
const {
  generateDraft,
  getDrafts,
  getDraftById,
  deleteDraft,
} = require('../controllers/draft.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { draftGenerationSchema } = require('../validation/schemas');
const { aiRateLimiter } = require('../middleware/rateLimiter');

router.use(protect);

router.post('/generate', aiRateLimiter, validate(draftGenerationSchema), generateDraft);
router.get('/', getDrafts);
router.get('/:id', getDraftById);
router.delete('/:id', deleteDraft);

module.exports = router;
