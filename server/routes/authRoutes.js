import express from 'express';
import { signup, login, getProfile, updateLocation } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateSignup, validateLogin, validateLocation } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/location', protect, validateLocation, updateLocation);

export default router;
