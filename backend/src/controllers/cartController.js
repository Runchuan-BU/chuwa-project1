// backend/controllers/cart.controller.js
import Cart from '../models/cart.js';
import Product from '../models/product.js';

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) return res.json({ items: [], total: 0 });

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

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    // 計算 total
    cart.total = cart.items.reduce((acc, item) => acc + item.quantity * product.price, 0);

    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Product not in cart' });

    cart.items[itemIndex].quantity = quantity;

    // 重新計算 total
    await cart.populate('items.product');
    cart.total = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    // 重新計算 total
    await cart.populate('items.product');
    cart.total = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
