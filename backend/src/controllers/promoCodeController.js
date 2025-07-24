// controllers/promoCodeController.js
import PromoCode from '../models/promoCode.js';

// Create new promo code (Admin only)
export const createPromoCode = async (req, res) => {
  try {
    const { code, discountPercent, expiresAt } = req.body;

    // Validation
    if (!code || !discountPercent || !expiresAt) {
      return res.status(400).json({ 
        message: 'Code, discount percentage, and expiration date are required' 
      });
    }

    if (discountPercent < 1 || discountPercent > 100) {
      return res.status(400).json({ 
        message: 'Discount percentage must be between 1 and 100' 
      });
    }

    const expirationDate = new Date(expiresAt);
    if (expirationDate <= new Date()) {
      return res.status(400).json({ 
        message: 'Expiration date must be in the future' 
      });
    }

    // Check if code already exists
    const existingCode = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      return res.status(400).json({ message: 'Promo code already exists' });
    }

    const promoCode = new PromoCode({
      code: code.toUpperCase(),
      discountPercent,
      expiresAt: expirationDate
    });

    await promoCode.save();

    res.status(201).json({
      message: 'Promo code created successfully',
      promoCode
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all promo codes (Admin only)
export const getAllPromoCodes = async (req, res) => {
  try {
    const { active } = req.query;
    let query = {};

    if (active === 'true') {
      query.expiresAt = { $gt: new Date() };
    } else if (active === 'false') {
      query.expiresAt = { $lte: new Date() };
    }

    const promoCodes = await PromoCode.find(query).sort({ createdAt: -1 });
    
    res.json({
      total: promoCodes.length,
      promoCodes
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single promo code (Admin only)
export const getPromoCode = async (req, res) => {
  try {
    const { code } = req.params;
    
    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    res.json(promoCode);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update promo code (Admin only)
export const updatePromoCode = async (req, res) => {
  try {
    const { code } = req.params;
    const { discountPercent, expiresAt } = req.body;

    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    if (discountPercent !== undefined) {
      if (discountPercent < 1 || discountPercent > 100) {
        return res.status(400).json({ 
          message: 'Discount percentage must be between 1 and 100' 
        });
      }
      promoCode.discountPercent = discountPercent;
    }

    if (expiresAt) {
      const expirationDate = new Date(expiresAt);
      if (expirationDate <= new Date()) {
        return res.status(400).json({ 
          message: 'Expiration date must be in the future' 
        });
      }
      promoCode.expiresAt = expirationDate;
    }

    await promoCode.save();

    res.json({
      message: 'Promo code updated successfully',
      promoCode
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete promo code (Admin only)
export const deletePromoCode = async (req, res) => {
  try {
    const { code } = req.params;

    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    await promoCode.deleteOne();

    res.json({ message: 'Promo code deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Validate promo code 
export const validatePromoCode = async (req, res) => {
  try {
    const { code } = req.params;

    const promoCode = await PromoCode.findOne({ 
      code: code.toUpperCase(),
      expiresAt: { $gt: new Date() }
    });

    if (!promoCode) {
      return res.status(400).json({ 
        valid: false,
        message: 'Invalid or expired promo code' 
      });
    }

    res.json({
      valid: true,
      code: promoCode.code,
      discountPercent: promoCode.discountPercent,
      expiresAt: promoCode.expiresAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};