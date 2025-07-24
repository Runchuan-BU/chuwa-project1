import express from 'express';
import { signup, signin, updatePassword, getProfile } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.patch('/update-password', auth, updatePassword);
router.get('/profile', auth, getProfile);

export default router;
