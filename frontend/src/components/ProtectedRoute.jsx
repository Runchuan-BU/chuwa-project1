import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Check if admin role is required
  if (requireAdmin && user?.role !== 'admin') {
    return (
      <div className="container-primary">
        <div className="card-primary text-center">
          <h2 className="title-primary text-red-600">Access Denied</h2>
          <p className="text-content mb-4">
            This page requires administrator privileges.
          </p>
          <p className="text-help mb-6">
            Current user: <strong>{user?.email || 'Unknown'}</strong> ({user?.role || 'No role'})
          </p>
          <button 
            onClick={() => window.history.back()}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute; 