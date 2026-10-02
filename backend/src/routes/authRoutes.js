import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { forgotPassword, resetPassword } from '../controllers/passwordController.js';

import {
  register,
  login
} from '../controllers/authController.js';

const router = express.Router();
router.get('/profile', requireAuth, getProfile);
router.patch('/profile', requireAuth, updateProfile);
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
