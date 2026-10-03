import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { listNotifications } from '../controllers/notificationController.js';
const router = express.Router();
router.get('/', requireAuth, listNotifications);
export default router;
