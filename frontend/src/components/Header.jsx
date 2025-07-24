import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authLogout, clearCartLocal } from '../store';

export default function Header() {
  const { items: cartItems, isLoading: cartLoading } = useSelector(state => state.cart);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  // Calculate cart item count - handle both authenticated and non-authenticated states
  const cartItemCount = isAuthenticated && cartItems 
    ? cartItems.reduce((total, item) => total + item.quantity, 0) 
    : 0;
  
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear cart data
    dispatch(clearCartLocal());
    dispatch(authLogout());
  };

  return (
    <nav className="header-nav">
      <div className="header-container">
        <div className="header-content">
          <Link to="/" className="header-logo">
            E-Commerce Store
          </Link>
          
          <div className="header-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            
            {isAuthenticated && isAdmin && (
              <Link to="/product/new" className="nav-link">
                Add Product
              </Link>
            )}
            
            <Link to="/cart" className="nav-link relative">
              Cart
              {isAuthenticated && (
                <>
                  {cartLoading ? (
                    <span className="cart-badge">
                      ...
                    </span>
                  ) : cartItemCount > 0 ? (
                    <span className="cart-badge">
                      {cartItemCount}
                    </span>
                  ) : null}
                </>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  Welcome, {user?.username} 
                  {isAdmin && <span className="text-blue-600 text-sm ml-1">(Admin)</span>}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-danger"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn-primary">
                Sign In / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 