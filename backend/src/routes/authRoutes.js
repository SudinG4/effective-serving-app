import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { forgotPassword, resetPassword } from '../controllers/passwordController.js';

import {
  register,
  login
} from '../controllers/authController.js';

const router = express.Router();
router.get('/me', requireAuth, (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ success: true, user: { id: req.user.id, role: req.user.app_metadata.role } });
});
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post(
  '/register',
  register
);

router.post(
  '/login',
  login
);

export default router;
