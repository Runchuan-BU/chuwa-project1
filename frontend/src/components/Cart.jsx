import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItemAPI, removeFromCartAPI, clearCartLocal } from '../store';

export default function Cart() {
  const { items, total, isLoading, error } = useSelector(state => state.cart);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoError, setPromoError] = useState('');

  // Load cart when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    } else {
      // Clear cart if user is not authenticated
      dispatch(clearCartLocal());
    }
  }, [isAuthenticated, dispatch]);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="container-primary">
        <div className="cart-header">
          <h2 className="title-primary">Shopping Cart</h2>
          <button 
            onClick={() => navigate('/')}
            className="btn-outline"
          >
            ← Back to Shopping
          </button>
        </div>
        <div className="empty-state">
          <h3 className="cart-item-title text-center mb-4">Please Sign In</h3>
          <p className="cart-empty-text">You need to sign in to use the shopping cart</p>
          <p className="cart-empty-subtitle">Sign in to save your items and checkout!</p>
          <div className="auth-prompt">
            <button 
              onClick={() => navigate('/auth')}
              className="btn-primary"
            >
              Sign In / Sign Up
            </button>
            <button 
              onClick={() => navigate('/')}
              className="btn-outline"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = total || 0;
  const discountAmount = subtotal * (promoDiscount / 100);
  const finalTotal = subtotal - discountAmount;

  const handleRemoveItem = async (productId) => {
    try {
      await dispatch(removeFromCartAPI(productId)).unwrap();
    } catch (error) {
      console.error('Failed to remove item:', error);
      
      // Check if it's an authentication error
      if (error.includes('logged in') || error.includes('authorized') || error.includes('token')) {
        console.log('Authentication error, redirecting to login...');
        navigate('/auth');
        return;
      }
      
      // If there's any error removing item, refresh cart to ensure sync
      console.log('Error removing item, refreshing cart...');
      dispatch(fetchCart());
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    console.log('Updating quantity for productId:', productId, 'to quantity:', newQuantity);
    console.log('Available cart items:', items.map(item => ({
      productId: item.product?.id,
      productName: item.product?.name,
      quantity: item.quantity
    })));
    
    if (newQuantity > 0) {
      try {
        await dispatch(updateCartItemAPI({ productId, quantity: newQuantity })).unwrap();
      } catch (error) {
        console.error('Failed to update quantity:', error);
        
        // Check if it's an authentication error
        if (error.includes('logged in') || error.includes('authorized') || error.includes('token')) {
          navigate('/auth');
          return;
        }
        
        // If product not found in cart, refresh cart data
        if (error.includes('not found in cart') || error.includes('not in cart')) {
          dispatch(fetchCart());
        }
      }
    } else {
      handleRemoveItem(productId);
    }
  };

  const handleApplyPromoCode = () => {
    setPromoError('');
    setPromoMessage('');

    const validPromoCodes = {
      'SAVE10': 10,
      'SAVE20': 20,
      'WELCOME15': 15,
      'STUDENT5': 5,
    };

    const code = promoCode.toUpperCase().trim();
    
    if (!code) {
      setPromoError('Please enter a promo code');
      return;
    }

    if (validPromoCodes[code]) {
      setPromoDiscount(validPromoCodes[code]);
      setPromoMessage(`Promo code applied! ${validPromoCodes[code]}% discount`);
    } else {
      setPromoError('Invalid promo code');
      setPromoDiscount(0);
    }
  };

  const handleRemovePromoCode = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoMessage('');
    setPromoError('');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container-primary">
        <div className="cart-header">
          <h2 className="title-primary">Shopping Cart</h2>
          <button 
            onClick={() => navigate('/')}
            className="btn-outline"
          >
            ← Continue Shopping
          </button>
        </div>
        <div className="empty-state">
          <div className="loading-spinner mx-auto"></div>
          <p className="cart-empty-text mt-4">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container-primary">
        <div className="cart-header">
          <h2 className="title-primary">Shopping Cart</h2>
          <button 
            onClick={() => navigate('/')}
            className="btn-outline"
          >
            ← Continue Shopping
          </button>
        </div>
        <div className="empty-state">
          <p className="text-error text-center">Error loading cart: {error}</p>
          <button 
            onClick={() => dispatch(fetchCart())}
            className="btn-primary mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!items || items.length === 0) {
    return (
      <div className="container-primary">
        <div className="cart-header">
          <h2 className="title-primary">Shopping Cart</h2>
          <button 
            onClick={() => navigate('/')}
            className="btn-outline"
          >
            ← Back to Shopping
          </button>
        </div>
        <div className="empty-state">
          <p className="cart-empty-text">Your cart is empty</p>
          <p className="cart-empty-subtitle">Add some products to get started!</p>
          <button 
            onClick={() => navigate('/')}
            className="cart-continue-shopping"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-primary">
      <div className="cart-header">
        <h2 className="title-primary">Shopping Cart</h2>
        <button 
          onClick={() => navigate('/')}
          className="btn-outline"
        >
          ← Continue Shopping
        </button>
      </div>
      
      <div className="cart-items-list">
        {items.map((item, index) => (
          <div key={item.product?.id || `cart-item-${index}`} className="cart-item">
            <img 
              src={item.product.image} 
              alt={item.product.name}
              className="cart-item-image"
            />
            
            <div className="cart-item-content">
              <h3 className="cart-item-title">{item.product.name}</h3>
              <p className="cart-item-price">${item.product.price}</p>
            </div>
            
            <div className="cart-quantity-controls">
              <button
                onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                className="quantity-btn"
                disabled={isLoading}
              >
                -
              </button>
              
              <span className="quantity-display">
                {item.quantity}
              </span>
              
              <button
                onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                className="quantity-btn"
                disabled={isLoading}
              >
                +
              </button>
            </div>
            
            <div className="cart-item-actions">
              <p className="cart-item-total">${(item.product.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => handleRemoveItem(item.product.id)}
                className="cart-remove-btn"
                disabled={isLoading}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Promo Code Section */}
      <div className="section-primary">
        <h3 className="subtitle-primary">Promo Code</h3>
        
        {!promoDiscount ? (
          <div className="promo-input-container">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="input-primary"
            />
            <button
              onClick={handleApplyPromoCode}
              className="btn-primary"
            >
              Apply
            </button>
          </div>
        ) : (
          <div className="promo-success">
            <span className="promo-success-text">{promoMessage}</span>
            <button
              onClick={handleRemovePromoCode}
              className="promo-remove-btn"
            >
              Remove
            </button>
          </div>
        )}

        {promoError && (
          <p className="text-error">{promoError}</p>
        )}

        <div className="cart-promo-help">
          Try these codes: SAVE10, SAVE20, WELCOME15, STUDENT5
        </div>
      </div>

      {/* Order Summary */}
      <div className="section-primary">
        <h3 className="subtitle-primary">Order Summary</h3>
        
        <div className="order-summary-details">
          <div className="flex-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          {promoDiscount > 0 && (
            <div className="flex-between price-highlight">
              <span>Discount ({promoDiscount}%):</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          
          <hr className="order-summary-divider" />
          
          <div className="flex-between order-total">
            <span>Total:</span>
            <span className="price-highlight">${finalTotal.toFixed(2)}</span>
          </div>
        </div>
        
        <button className="btn-primary checkout-btn" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
} 