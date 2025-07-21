import { Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import ProductEditPage from './pages/ProductEditPage';
import CartPage from './pages/CartPage';

function App() {
  console.log('🚀 E-commerce App Loading...');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} /> {/* Protected route */}
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/product/edit/:id" element={<ProductEditPage />} /> {/* Protected route */}
        <Route path="/product/new" element={<ProductEditPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/projects" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;