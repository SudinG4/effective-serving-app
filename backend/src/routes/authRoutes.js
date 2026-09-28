import express from 'express';
import { forgotPassword, resetPassword } from '../controllers/passwordController.js';

import {
  register,
  login
} from '../controllers/authController.js';

const router = express.Router();
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
