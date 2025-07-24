import express from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from '../controllers/cartController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getCart);
router.post('/', auth, addToCart);
router.put('/', auth, updateCartItem);
router.delete('/:productId', auth, removeCartItem);

export default router;