import express from 'express';
import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/', protect, updateCart);
router.delete('/:productId', protect, removeFromCart);

export default router;