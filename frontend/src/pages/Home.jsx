import Header from '../components/Header';
import ProductList from "../components/ProductList";

export default function Home() {
  return (
    <div className="home-page-container">
      <Header />

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">Welcome to Our Store</h1>
          <p className="hero-description">Discover amazing products at great prices</p>
          <div className="hero-buttons">
            <button className="hero-button-primary">
              Shop Now
            </button>
            <button className="hero-button-outline">
              Learn More
            </button>
          </div>
        </div>
      </header>

      {/* Products Section */}
      <main className="products-main">
        <div className="products-container">
          <h2 className="products-title">Featured Products</h2>
          <ProductList />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-content">
            <p>&copy; 2025 E-Commerce Store. All rights reserved.</p>
            <p className="footer-secondary-text">Built with React & Node.js</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
