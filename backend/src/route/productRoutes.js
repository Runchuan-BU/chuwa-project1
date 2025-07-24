import express from 'express';
import { 
  listProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', listProducts);           // GET /api/products
router.get('/:id', getProduct);         // GET /api/products/:id

// Protected routes (admin only)
router.post('/', adminAuth, createProduct);        // POST /api/products
router.put('/:id', adminAuth, updateProduct);      // PUT /api/products/:id
router.delete('/:id', adminAuth, deleteProduct);   // DELETE /api/products/:id

export default router;