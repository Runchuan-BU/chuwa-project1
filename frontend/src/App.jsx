import { Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import ProductEditPage from './pages/ProductEditPage';
import CartPage from './pages/CartPage';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  console.log('🚀 E-commerce App Loading...');
  
  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route 
          path="/product/edit/:id" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <ProductEditPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/product/new" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <ProductEditPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/projects" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
    </ErrorBoundary>
  );
}

export default App;