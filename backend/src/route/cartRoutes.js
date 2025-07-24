import express from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from '../controllers/cartController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         product:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: 507f1f77bcf86cd799439011
 *             name:
 *               type: string
 *               example: iPhone 15 Pro
 *             description:
 *               type: string
 *               example: Latest iPhone with advanced features
 *             price:
 *               type: number
 *               example: 999.99
 *             image:
 *               type: string
 *               example: https://example.com/image.jpg
 *             category:
 *               type: string
 *               example: Electronics
 *             stock:
 *               type: integer
 *               example: 50
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
 *           example: ""
 *           description: Applied promo code
 *         total:
 *           type: number
 *           format: float
 *           example: 1999.98
 *           description: Total cart value
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
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
 *           description: ID of the product to add
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *           description: Quantity to add
 *     
 *     UpdateCartRequest:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *           description: ID of the product to update
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 3
 *           description: New quantity
 *     
 *     EmptyCart:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *           example: []
 *         total:
 *           type: number
 *           example: 0
 */

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     description: Retrieve the current user's shopping cart with all items
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Cart'
 *                 - $ref: '#/components/schemas/EmptyCart'
 *             examples:
 *               withItems:
 *                 summary: Cart with items
 *                 value:
 *                   _id: "507f1f77bcf86cd799439011"
 *                   user: "507f1f77bcf86cd799439011"
 *                   items:
 *                     - product:
 *                         id: "507f1f77bcf86cd799439011"
 *                         name: "iPhone 15 Pro"
 *                         price: 999.99
 *                       quantity: 2
 *                   total: 1999.98
 *               empty:
 *                 summary: Empty cart
 *                 value:
 *                   items: []
 *                   total: 0
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/', auth, getCart);
/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     description: Add a product to the user's shopping cart or increase quantity if already exists
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartRequest'
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               invalidQuantity:
 *                 value:
 *                   message: Quantity must be at least 1
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/', auth, addToCart);
/**
 * @swagger
 * /api/cart:
 *   put:
 *     summary: Update cart item quantity
 *     description: Update the quantity of a specific item in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartRequest'
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quantity must be at least 1
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cart or product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               cartNotFound:
 *                 value:
 *                   message: Cart not found
 *               productNotInCart:
 *                 value:
 *                   message: Product not found in cart. Cart has been refreshed.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put('/', auth, updateCartItem);
/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Remove a specific product from the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete('/:productId', auth, removeCartItem);

export default router;