import express from 'express';
import { signUp, login, logout, updatePassword } from '../controllers/authController.js';
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', login);
router.post('/logout', logout);
router.patch('/update-password', updatePassword);

export default router;
