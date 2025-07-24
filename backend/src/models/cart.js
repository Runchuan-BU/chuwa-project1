// models/cart.js
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      }
    }
  ],
  promoCode: {
    type: String,
    default: ''
  },
  discountPercent: {
    type: Number,
    default: 0
  },
  subtotal: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  //after discount
  total: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Virtual property to calculate final total
cartSchema.methods.calculateTotals = function() {
  // Calculate subtotal
  this.subtotal = this.items.reduce((acc, item) => {
    if (item.product && item.product.price) {
      return acc + (item.quantity * item.product.price);
    }
    return acc;
  }, 0);

  // Calculate discount
  this.discountAmount = this.subtotal * (this.discountPercent / 100);
  
  // Calculate final total
  this.total = this.subtotal - this.discountAmount;
  
  return this;
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;