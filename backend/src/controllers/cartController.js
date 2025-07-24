// backend/controllers/cart.controller.js
import Cart from '../models/cart.js';
import Product from '../models/product.js';

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) return res.json({ items: [], total: 0 });

    // Filter out items where product no longer exists (was deleted)
    cart.items = cart.items.filter(item => item.product !== null);
    
    // Recalculate total after filtering
    cart.total = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
    
    // Save the cleaned cart
    await cart.save();

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

    // Populate products and calculate total
    await cart.populate('items.product');
    cart.total = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

    // First populate the cart to get full product data
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Filter out any null products first (products that were deleted)
    cart.items = cart.items.filter(item => item.product !== null);

    // Find the item by comparing with the populated product._id (also works with product.id)
    const itemIndex = cart.items.findIndex(item => 
      item.product._id.toString() === productId || item.product.id === productId
    );
    
    if (itemIndex === -1) {
      // Save the cleaned cart and return error
      cart.total = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
      await cart.save();
      return res.status(404).json({ message: 'Product not found in cart. Cart has been refreshed.' });
    }

    // Update the quantity
    cart.items[itemIndex].quantity = quantity;

    // Recalculate total
    cart.total = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    // First populate the cart to get full product data
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Filter out any null products first (products that were deleted)
    cart.items = cart.items.filter(item => item.product !== null);

    // Remove the specific product by comparing with populated product._id (also works with product.id)
    cart.items = cart.items.filter(item => 
      item.product._id.toString() !== productId && item.product.id !== productId
    );

    // Recalculate total
    cart.total = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
