import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { listReports, downloadReport } from '../controllers/reportController.js';
const router = express.Router();
router.use(requireAuth);
router.get('/', listReports);
router.get('/:id/download', downloadReport);
export default router;
