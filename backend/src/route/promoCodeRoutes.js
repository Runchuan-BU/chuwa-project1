// routes/promoCodeRoutes.js
import express from 'express';
import {
  createPromoCode,
  getAllPromoCodes,
  getPromoCode,
  updatePromoCode,
  deletePromoCode,
  validatePromoCode
} from '../controllers/promoCodeController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     PromoCode:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         code:
 *           type: string
 *           example: SUMMER20
 *         discountPercent:
 *           type: number
 *           minimum: 1
 *           maximum: 100
 *           example: 20
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           example: 2024-12-31T23:59:59.000Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     CreatePromoCodeRequest:
 *       type: object
 *       required:
 *         - code
 *         - discountPercent
 *         - expiresAt
 *       properties:
 *         code:
 *           type: string
 *           example: SUMMER20
 *         discountPercent:
 *           type: number
 *           minimum: 1
 *           maximum: 100
 *           example: 20
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           example: 2024-12-31T23:59:59.000Z
 *     
 *     UpdatePromoCodeRequest:
 *       type: object
 *       properties:
 *         discountPercent:
 *           type: number
 *           minimum: 1
 *           maximum: 100
 *           example: 25
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           example: 2025-01-31T23:59:59.000Z
 *     
 *     PromoCodeValidation:
 *       type: object
 *       properties:
 *         valid:
 *           type: boolean
 *           example: true
 *         code:
 *           type: string
 *           example: SUMMER20
 *         discountPercent:
 *           type: number
 *           example: 20
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         message:
 *           type: string
 *           example: Valid promo code
 */

/**
 * @swagger
 * tags:
 *   name: Promo Codes
 *   description: Promo code management (Admin only)
 */

// Public route - validate promo code
/**
 * @swagger
 * /api/promo-codes/validate/{code}:
 *   get:
 *     summary: Validate promo code
 *     description: Check if a promo code is valid (public endpoint)
 *     tags: [Promo Codes]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Promo code to validate
 *     responses:
 *       200:
 *         description: Validation result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromoCodeValidation'
 */
router.get('/validate/:code', validatePromoCode);

// Admin only routes
/**
 * @swagger
 * /api/promo-codes:
 *   post:
 *     summary: Create new promo code
 *     description: Create a new promo code (Admin only)
 *     tags: [Promo Codes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePromoCodeRequest'
 *     responses:
 *       201:
 *         description: Promo code created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromoCode'
 *       400:
 *         description: Invalid input or code already exists
 *       403:
 *         description: Admin access only
 */
router.post('/', protect, isAdmin, createPromoCode);

/**
 * @swagger
 * /api/promo-codes:
 *   get:
 *     summary: Get all promo codes
 *     description: Retrieve all promo codes (Admin only)
 *     tags: [Promo Codes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by active/expired status
 *     responses:
 *       200:
 *         description: List of promo codes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 promoCodes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PromoCode'
 */
router.get('/', protect, isAdmin, getAllPromoCodes);

/**
 * @swagger
 * /api/promo-codes/{code}:
 *   get:
 *     summary: Get specific promo code
 *     description: Get details of a specific promo code (Admin only)
 *     tags: [Promo Codes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promo code details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromoCode'
 *       404:
 *         description: Promo code not found
 */
router.get('/:code', protect, isAdmin, getPromoCode);

/**
 * @swagger
 * /api/promo-codes/{code}:
 *   put:
 *     summary: Update promo code
 *     description: Update an existing promo code (Admin only)
 *     tags: [Promo Codes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePromoCodeRequest'
 *     responses:
 *       200:
 *         description: Promo code updated successfully
 *       404:
 *         description: Promo code not found
 */
router.put('/:code', protect, isAdmin, updatePromoCode);

/**
 * @swagger
 * /api/promo-codes/{code}:
 *   delete:
 *     summary: Delete promo code
 *     description: Delete a promo code (Admin only)
 *     tags: [Promo Codes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promo code deleted successfully
 *       404:
 *         description: Promo code not found
 */
router.delete('/:code', protect, isAdmin, deletePromoCode);

export default router;