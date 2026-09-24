import express from 'express';

import {
  createAssessment,
  getAssessments,
  getAssessmentById
} from '../controllers/assessmentController.js';

import {
  requireAuth
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.post(
  '/',
  createAssessment
);

router.get(
  '/',
  getAssessments
);

router.get(
  '/:id',
  getAssessmentById
);

export default router;