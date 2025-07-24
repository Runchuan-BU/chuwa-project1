import { useState } from 'react';
import { useSelector } from 'react-redux';
import client from '../api/client';

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const { isAuthenticated } = useSelector(state => state.auth);

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

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    
    if (!isAuthenticated) {
      setErrors({ general: 'Please sign in to change your password' });
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await client.patch('/auth/update-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      if (response.data.success) {
        setSuccess('Password updated successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-card">
      <h2 className="auth-form-title">Change Password</h2>
      
      <div className="auth-form-content">
        {!isAuthenticated && (
          <div className="auth-form-alert-warning">
            Please sign in to change your password
          </div>
        )}

        {errors.general && (
          <div className="auth-form-alert-error">
            {errors.general}
          </div>
        )}

        {success && (
          <div className="auth-form-alert-success">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="label-primary">
              Current Password *
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={errors.currentPassword ? 'input-error' : 'input-primary'}
              required
              disabled={!isAuthenticated}
            />
            {errors.currentPassword && <p className="text-error">{errors.currentPassword}</p>}
          </div>
          
          <div>
            <label htmlFor="newPassword" className="label-primary">
              New Password *
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={errors.newPassword ? 'input-error' : 'input-primary'}
              required
              disabled={!isAuthenticated}
            />
            {errors.newPassword && <p className="text-error">{errors.newPassword}</p>}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="label-primary">
              Confirm New Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'input-error' : 'input-primary'}
              required
              disabled={!isAuthenticated}
            />
            {errors.confirmPassword && <p className="text-error">{errors.confirmPassword}</p>}
          </div>
          
          <button
            type="submit"
            disabled={loading || !isAuthenticated}
            className="btn-primary btn-disabled w-full"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
