import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addProduct, updateProduct } from '../store';
import client from '../api/client';

export default function ProductForm({ productId }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'Electronics',
    stock: '',
  });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Check authentication and admin role
  if (!isAuthenticated) {
    return (
      <div className="product-form-access-denied">
        <h2 className="product-form-error-title">Authentication Required</h2>
        <p className="product-form-error-message">Please sign in to access this page.</p>
        <button 
          onClick={() => navigate('/auth')}
          className="btn-primary"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="product-form-access-denied">
        <h2 className="product-form-error-title">Admin Access Required</h2>
        <p className="product-form-error-message">
          Only administrators can create or edit products.
        </p>
        <p className="product-form-user-info">
          Current user: <strong>{user?.email}</strong> ({user?.role})
        </p>
        <button 
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Back to Home
        </button>
      </div>
    );
  }

  useEffect(() => {
    if (productId) {
      setIsEdit(true);
      const fetchProduct = async () => {
        try {
          const response = await client.get(`/products/${productId}`);
          if (response.data.success) {
            const product = response.data.product;
            setFormData({
              name: product.name,
              description: product.description,
              price: product.price.toString(),
              image: product.image,
              category: product.category,
              stock: product.stock.toString(),
            });
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          setError('Failed to load product data');
        }
      };
      fetchProduct();
    }
  }, [productId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      if (isEdit) {
        const response = await client.put(`/products/${productId}`, productData);
        if (response.data.success) {
          dispatch(updateProduct({ id: productId, ...productData }));
          setSuccess('Product updated successfully!');
        }
      } else {
        const response = await client.post('/products', productData);
        if (response.data.success) {
          dispatch(addProduct(response.data.product));
          setSuccess('Product created successfully!');
          
          // Reset form for new product
          setFormData({
            name: '',
            description: '',
            price: '',
            image: '',
            category: 'Electronics',
            stock: '',
          });

          // Navigate to home after successful creation
          setTimeout(() => {
            navigate('/');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save product';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-primary">
      <div className="product-form-header">
        <h2 className="title-primary">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button 
          type="button"
          onClick={() => navigate('/')}
          className="btn-outline"
        >
          ← Back to Home
        </button>
      </div>
      
      {error && (
        <div className="product-form-error-alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="product-form-success-alert">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="product-form">
        <div>
          <label htmlFor="name" className="label-primary">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="input-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="label-primary">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows="4"
            className="input-primary"
            required
          />
        </div>

        <div className="product-form-grid">
          <div>
            <label htmlFor="price" className="label-primary">
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="input-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="stock" className="label-primary">
              Stock Quantity *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="input-primary"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="label-primary">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-primary"
          >
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Home">Home & Garden</option>
            <option value="Sports">Sports</option>
            <option value="Toys">Toys</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="image" className="label-primary">
            Image URL *
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="input-primary"
            required
          />
        </div>

        {formData.image && (
          <div>
            <label className="label-primary">
              Image Preview
            </label>
            <img
              src={formData.image}
              alt="Product preview"
              className="product-form-image-preview"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="product-form-actions">
          <button
            type="submit"
            disabled={loading}
            className="product-form-submit"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Add Product')}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/')}
            className="product-form-cancel"
          >
            Cancel & Return
          </button>
        </div>
      </form>
    </div>
  );
}
