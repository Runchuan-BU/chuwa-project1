import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure, fetchCart } from '../store';
import client from '../api/client';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
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

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const signupData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      const response = await client.post('/auth/signup', signupData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        dispatch(loginSuccess({
          user: response.data.user,
          token: response.data.token
        }));

        // Fetch user's cart after successful registration and auto-login
        dispatch(fetchCart());

        // Navigate to home page after successful registration and auto-login
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch(loginFailure(errorMessage));
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-card">
      <h2 className="auth-form-title">Sign Up</h2>
      
      <div className="auth-form-content">
        {errors.general && (
          <div className="auth-form-alert-error">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="label-primary">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'input-error' : 'input-primary'}
              required
            />
            {errors.username && <p className="text-error">{errors.username}</p>}
          </div>
          
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
          
          <div>
            <label htmlFor="confirmPassword" className="label-primary">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'input-error' : 'input-primary'}
              required
            />
            {errors.confirmPassword && <p className="text-error">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label htmlFor="role" className="label-primary">
              Account Type
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-primary"
            >
              <option value="user">Regular User</option>
              <option value="admin">Admin (Vendor)</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-disabled w-full"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
} 