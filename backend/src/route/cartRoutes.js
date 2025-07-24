import express from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  applyPromoCode,
  removePromoCode,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *     
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         user:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         promoCode:
 *           type: string
 *           example: SUMMER20
 *         discountPercent:
 *           type: number
 *           example: 20
 *         subtotal:
 *           type: number
 *           example: 100
 *         discountAmount:
 *           type: number
 *           example: 20
 *         total:
 *           type: number
 *           example: 80
 *     
 *     AddToCartRequest:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *     
 *     ApplyPromoRequest:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 *           example: SUMMER20
 */

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management with promo code support
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.get('/', protect, getCart);
/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartRequest'
 *     responses:
 *       200:
 *         description: Item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.post('/', protect, addToCart);
/**
 * @swagger
 * /api/cart:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *       application/json:
 *          schema:
 *             $ref: '#/components/schemas/AddToCartRequest'
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 */
router.put('/', protect, updateCartItem);

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Item removed successfully
 *         content:
 *           application/json:
 */
router.delete('/:productId', protect, removeCartItem);
/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear entire cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 */
router.delete('/clear', protect, clearCart);

// Promo code 
/**
 * @swagger
 * /api/cart/promo:
 *   post:
 *     summary: Apply promo code to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplyPromoRequest'
 *     responses:
 *       200:
 *         description: Promo code applied successfully
 *       content:
 *         application/json:
 *       400:
 *         description: Invalid or expired promo code
 */
router.post('/promo', protect, applyPromoCode);
/**
 * @swagger
 * /api/cart/promo:
 *   delete:
 *     summary: Remove promo code from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Promo code removed successfully
 *         content:
 *           application/json:
 */
router.delete('/promo', protect, removePromoCode);

export default router;