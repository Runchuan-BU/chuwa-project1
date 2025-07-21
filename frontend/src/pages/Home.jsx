import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductList from "../components/ProductList";

const Home = () => {
  const cartItems = useSelector(state => state.cart?.items || []);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              E-Commerce Store
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/auth" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Account
              </Link>
              <Link 
                to="/product/new" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Add Product
              </Link>
              <Link 
                to="/cart" 
                className="relative text-gray-700 hover:text-blue-600 transition-colors"
              >
                Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Store</h1>
          <p className="text-xl mb-6">Discover amazing products at great prices</p>
          <div className="flex space-x-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </header>

      {/* Products Section */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
          <ProductList />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p>&copy; 2025 E-Commerce Store. All rights reserved.</p>
            <p className="text-gray-400 mt-2">Built with React & Node.js</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
