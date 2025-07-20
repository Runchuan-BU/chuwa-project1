import { Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import ProductEditPage from './pages/ProductEditPage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />  //need protect
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/product/edit/:id" element={<ProductEditPage />} /> //need protect
        <Route path="/product/new" element={<ProductEditPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </div>
  );
}

export default App;