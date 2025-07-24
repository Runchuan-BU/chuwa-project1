import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAPI } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [addToCartStates, setAddToCartStates] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { isLoading: cartLoading } = useSelector(state => state.cart);
  const isAdmin = user?.role === 'admin';

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      // Redirect to auth page if not authenticated
      navigate('/auth');
      return;
    }

    const productId = product.id;
    
    // Set loading state for this specific product
    setAddToCartStates(prev => ({ ...prev, [productId]: 'loading' }));
    
    try {
      await dispatch(addToCartAPI({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })).unwrap();
      
      // Set success state
      setAddToCartStates(prev => ({ ...prev, [productId]: 'success' }));
      
      // Clear state after 2 seconds
      setTimeout(() => {
        setAddToCartStates(prev => ({ ...prev, [productId]: null }));
      }, 2000);
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
      
      // Set error state
      setAddToCartStates(prev => ({ ...prev, [productId]: 'error' }));
      
      // Clear error state after 3 seconds
      setTimeout(() => {
        setAddToCartStates(prev => ({ ...prev, [productId]: null }));
      }, 3000);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await client.delete(`/products/${productId}`);
      if (response.data.success) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

    const fetchProducts = async () => {
      try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
        search: searchTerm,
      });

      const res = await client.get(`/products?${params}`);
        if (res.data.success) {
          setProducts(res.data.products);
        setTotalPages(res.data.pages || 1);
        setTotalProducts(res.data.total || 0);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      }
    };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-large">
      {/* Search Section */}
      <div className="mb-8">
        <form onSubmit={handleSearchSubmit} className="flex gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-primary"
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
          >
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="btn-secondary"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Results Summary */}
      <div className="flex-between mb-6">
        <h2 className="title-primary">
          {searchTerm ? `Search Results for "${searchTerm}"` : 'All Products'}
        </h2>
        <span className="text-gray-600">
          {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex-center py-12">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <>
          {products.length === 0 ? (
            <div className="empty-state">
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No products found matching your search.' : 'No products available.'}
              </p>
            </div>
          ) : (
            <div className="grid-products">
        {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <Link to={`/product/${product.id}`}>
            <img 
              src={product.image} 
              alt={product.name}
                        className="product-image hover:opacity-90 transition-opacity"
                      />
                    </Link>
                  </div>
                  
                  <div className="product-card-content">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="product-title">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="product-description">
                      {product.description}
                    </p>
                    
                    <div className="product-price-section">
                      <span className="product-price">
                        ${product.price}
                      </span>
                      <span className="product-stock">
                        Stock: {product.stock}
                      </span>
            </div>

                    {/* Action Buttons */}
                    <div className="product-actions">
                      {!isAuthenticated ? (
                        <button 
                          onClick={() => navigate('/auth')}
                          className="btn-outline w-full"
                        >
                          Sign In to Add to Cart
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="btn-primary w-full"
                          disabled={addToCartStates[product.id] === 'loading' || cartLoading}
                        >
                          {addToCartStates[product.id] === 'loading' ? 'Adding...' :
                           addToCartStates[product.id] === 'success' ? 'Added!' :
                           addToCartStates[product.id] === 'error' ? 'Failed - Try Again' :
                           'Add to Cart'}
                        </button>
                      )}

                      {/* Admin Controls */}
                      {isAuthenticated && isAdmin && (
                        <div className="admin-controls">
                          <Link
                            to={`/product/edit/${product.id}`}
                            className="product-edit-btn"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="product-delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
          </div>
        ))}
      </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={currentPage === page ? 'pagination-btn-active' : 'pagination-btn-inactive'}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}