// backend/controllers/cart.controller.js
import Cart from '../models/cart.js';
import Product from '../models/product.js';
import PromoCode from '../models/promoCode.js';

export const getCart = async (req, res) => {
 
  try {
     const user = req.user._id || req.user.id;
    const cart = await Cart.findOne({ user: user }).populate('items.product');
    if (!cart) {
    cart = new Cart({ 
      user: user, 
      items: [],
      total: 0 
    });
    await cart.save();
  }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addToCart = async (req, res) => {

  try {
    const { productId, quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
     const user = req.user._id || req.user.id;
    let cart = await Cart.findOne({ user: user });
    
    if (!cart) {
      cart = new Cart({ user: user, items: [] });
    }
                    //pull out item from cart       //objId 
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
       //if the products in cart exist
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }


    //calculate total 
    await cart.save();
    await cart.populate('items.product');

    // Calculate totals with discount
    cart.calculateTotals();
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
     const user = req.user._id || req.user.id;
    if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

    const cart = await Cart.findOne({ user: user });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Product not in cart' });

    cart.items[itemIndex].quantity = quantity;

    // re-calculate total with discount
    await cart.save();
    await cart.populate('items.product');
   
    cart.calculateTotals();

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
     const user = req.user._id || req.user.id;
    const cart = await Cart.findOne({ user: user });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
                                                   //filter out the id not the request sent
    cart.items = cart.items.filter(item => item.product.toString() !== productId);


    await cart.save();
    await cart.populate('items.product');
     //re-calculate subtotal and total
    cart.calculateTotals();
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
     const user = req.user._id || req.user.id;
    const cart = await Cart.findOne({ user: user });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    cart.total = 0;
    cart.subtotal =0;
    cart.discountPercent = 0;
    cart.discountAmount = 0;
    cart.promoCode = '';
    
    await cart.save();

    res.json({ message: 'Cart cleared', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const applyPromoCode = async (req, res) => {
  try {
    const { code } = req.body;
    const user = req.user._id || req.user.id;
    
    if (!code) {
      return res.status(400).json({ message: 'Promo code is required' });
    }

    const cart = await Cart.findOne({ user: user }).populate('items.product');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    if (cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Find promo code
    const promoCode = await PromoCode.findOne({ 
      code: code.toUpperCase(),
      expiresAt: { $gt: new Date() }
    });

    if (!promoCode) {
      return res.status(400).json({ message: 'Invalid or expired promo code' });
    }

    // Apply promo code
    cart.promoCode = promoCode.code;
    cart.discountPercent = promoCode.discountPercent;
    
    cart.calculateTotals();
    await cart.save();

    res.json({
      message: `Promo code applied! You saved ${promoCode.discountPercent}%`,
      cart
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removePromoCode = async (req, res) => {
  try {
    const user = req.user._id || req.user.id;
    const cart = await Cart.findOne({ user: user }).populate('items.product');
    
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Remove promo code
    cart.promoCode = '';
    cart.discountPercent = 0;
    
    cart.calculateTotals();
    await cart.save();

    res.json({
      message: 'Promo code removed',
      cart
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};