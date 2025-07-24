import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCartAPI } from '../store';
import client from '../api/client';

export default function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addToCartMessage, setAddToCartMessage] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { isLoading: cartLoading } = useSelector(state => state.cart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await client.get(`/products/${productId}`);
        if (response.data.success) {
          setProduct(response.data.product);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Show message and redirect to auth
      setAddToCartMessage('Please sign in to add items to cart');
      setTimeout(() => {
        navigate('/auth');
      }, 1500);
      return;
    }

    if (product) {
      setAddingToCart(true);
      setAddToCartMessage('');
      
      try {
        await dispatch(addToCartAPI({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
        })).unwrap();
        
        setAddToCartMessage(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`);
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setAddToCartMessage('');
        }, 3000);
        
      } catch (error) {
        console.error('Failed to add to cart:', error);
        setAddToCartMessage('Failed to add to cart. Please try again.');
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          setAddToCartMessage('');
        }, 3000);
      } finally {
        setAddingToCart(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="container-primary">
        <div className="product-detail-loading">
          <div className="product-detail-skeleton-image"></div>
          <div className="product-detail-skeleton-title"></div>
          <div className="product-detail-skeleton-text"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-primary empty-state">
        <h2 className="product-detail-not-found-title">Product Not Found</h2>
        <p className="product-detail-not-found-text">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container-primary">
      {/* Back to Home Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="product-detail-back-btn"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>
      </div>
      
      <div className="product-detail-grid">
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="product-detail-image"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="title-primary">{product.name}</h1>
          
          <div className="product-detail-price-container">
            <span className="product-detail-price">
              ${product.price}
            </span>
          </div>

          <div className="product-detail-meta">
            <h3 className="subtitle-primary">Description</h3>
            <p className="product-detail-description">
              {product.description}
            </p>
          </div>

          <div className="product-detail-meta">
            <p className="product-detail-meta-text">
              <span className="product-detail-meta-label">Category:</span> {product.category}
            </p>
            <p className="product-detail-meta-text">
              <span className="product-detail-meta-label">Stock:</span> {product.stock} available
            </p>
          </div>

          {/* Authentication Notice */}
          {!isAuthenticated && (
            <div className="product-detail-meta">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                <p className="text-blue-700 text-sm">
                  <strong>Sign in required:</strong> You need to sign in to add items to your cart.
                </p>
              </div>
            </div>
          )}

          {/* Add to Cart Message */}
          {addToCartMessage && (
            <div className="product-detail-meta">
              <div className={`border rounded-md p-3 mb-4 ${
                addToCartMessage.includes('Failed') || addToCartMessage.includes('Please sign in')
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}>
                <p className="text-sm">{addToCartMessage}</p>
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="product-detail-quantity-section">
            <label htmlFor="quantity" className="label-primary">
              Quantity
            </label>
            <div className="product-detail-quantity-controls">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="quantity-btn"
                disabled={addingToCart || cartLoading}
              >
                -
              </button>
              <span className="quantity-display">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="quantity-btn"
                disabled={addingToCart || cartLoading}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="product-detail-button-section">
            {product.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                className="product-detail-add-to-cart"
                disabled={addingToCart || cartLoading}
              >
                {addingToCart ? 'Adding...' : 
                 !isAuthenticated ? 'Sign In to Add to Cart' :
                 `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
              </button>
            ) : (
              <button
                disabled
                className="product-detail-out-of-stock"
              >
                Out of Stock
              </button>
            )}
          </div>

          {/* Product Features */}
          <div className="section-primary">
            <h3 className="subtitle-primary">Product Features</h3>
            <ul className="product-detail-features-list">
              <li className="product-detail-feature-item">
                <span className="product-detail-feature-bullet"></span>
                High quality materials
              </li>
              <li className="product-detail-feature-item">
                <span className="product-detail-feature-bullet"></span>
                Fast shipping available
              </li>
              <li className="product-detail-feature-item">
                <span className="product-detail-feature-bullet"></span>
                30-day return policy
              </li>
              <li className="product-detail-feature-item">
                <span className="product-detail-feature-bullet"></span>
                Customer support included
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}