import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure, fetchCart } from '../store';
import client from '../api/client';

export default function SignInForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    dispatch(loginStart());
    
    try {
      const response = await client.post('/auth/signin', formData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        dispatch(loginSuccess({
          user: response.data.user,
          token: response.data.token
        }));

        // Fetch user's cart after successful login
        dispatch(fetchCart());

        // Navigate to home page after successful login
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-card">
      <h2 className="auth-form-title">Sign In</h2>
      
      <div className="auth-form-content">
        {errors.general && (
          <div className="auth-form-alert-error">
            {errors.general}
          </div>
        )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="email" className="label-primary">
              Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
              className={errors.email ? 'input-error' : 'input-primary'}
            required
          />
            {errors.email && <p className="text-error">{errors.email}</p>}
        </div>
        
        <div>
            <label htmlFor="password" className="label-primary">
              Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
              className={errors.password ? 'input-error' : 'input-primary'}
            required
          />
            {errors.password && <p className="text-error">{errors.password}</p>}
        </div>
        
        <button
          type="submit"
            disabled={loading}
            className="btn-primary btn-disabled w-full"
        >
            {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
        <div className="mt-4 text-center">
          <p className="text-help mb-2">
            <strong>Demo Accounts:</strong>
          </p>
          <p className="text-help text-xs">
            Admin: admin@example.com | User: user@example.com
          </p>
          <p className="text-help text-xs">
            Password: password123 (for both accounts)
      </p>
        </div>
      </div>
    </div>
  );
}