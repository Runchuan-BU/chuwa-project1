import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Serve static files from frontend build
app.use(express.static(join(__dirname, '../frontend/dist')));

// Mock data for testing
const mockUsers = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' },
  { id: 2, username: 'user1', email: 'user1@example.com', role: 'user' }
];

const mockProducts = [
  { 
    id: 1, 
    name: 'iPhone 15 Pro', 
    description: 'Latest iPhone with advanced features',
    price: 999.99,
    image: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro',
    category: 'Electronics',
    stock: 50
  },
  { 
    id: 2, 
    name: 'MacBook Air M3', 
    description: 'Powerful laptop with M3 chip',
    price: 1299.99,
    image: 'https://via.placeholder.com/300x300?text=MacBook+Air',
    category: 'Electronics',
    stock: 30
  },
  { 
    id: 3, 
    name: 'AirPods Pro', 
    description: 'Wireless earbuds with active noise cancellation',
    price: 249.99,
    image: 'https://via.placeholder.com/300x300?text=AirPods+Pro',
    category: 'Electronics',
    stock: 100
  }
];

let mockCart = [];

// Auth Routes (Mock)
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  res.json({
    success: true,
    message: 'User registered successfully (mock)',
    user: { id: Date.now(), username, email, role: 'user' }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email);
  
  if (user) {
    res.json({
      success: true,
      message: 'Login successful (mock)',
      user: user,
      token: 'mock-jwt-token-' + Date.now()
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// User Routes (Mock)
app.get('/api/users/profile', (req, res) => {
  res.json({
    success: true,
    user: mockUsers[0]
  });
});

// Product Routes (Mock)
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    products: mockProducts,
    total: mockProducts.length
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = mockProducts.find(p => p.id === parseInt(req.params.id));
  
  if (product) {
    res.json({
      success: true,
      product: product
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    id: Date.now(),
    ...req.body
  };
  mockProducts.push(newProduct);
  
  res.status(201).json({
    success: true,
    message: 'Product created successfully (mock)',
    product: newProduct
  });
});

// Cart Routes (Mock)
app.get('/api/cart', (req, res) => {
  res.json({
    success: true,
    cart: mockCart,
    total: mockCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  });
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = mockProducts.find(p => p.id === parseInt(productId));
  
  if (product) {
    const existingItem = mockCart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      mockCart.push({
        id: Date.now(),
        productId: productId,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image
      });
    }
    
    res.json({
      success: true,
      message: 'Product added to cart',
      cart: mockCart
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
});

app.delete('/api/cart/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  mockCart = mockCart.filter(item => item.id !== itemId);
  
  res.json({
    success: true,
    message: 'Item removed from cart',
    cart: mockCart
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Server is running with mock data',
    timestamp: new Date().toISOString()
  });
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/dist/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Server running on port', PORT);
  console.log('📊 Using mock data (no database connection)');
  console.log('🌐 Frontend: http://localhost:3000');
  console.log('🔌 Backend: http://localhost:' + PORT);
}); 