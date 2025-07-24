import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
<<<<<<< Updated upstream
=======
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
>>>>>>> Stashed changes

import authRoutes from './src/route/authRoutes.js';
import productRoutes from './src/route/productRoutes.js';
import cartRoutes from './src/route/cartRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'E-commerce Backend API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'MongoDB Disconnected'
  });
});

// Basic API documentation
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'E-commerce Backend API',
    version: '1.0.0',
    database: 'MongoDB',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        signin: 'POST /api/auth/signin',
        updatePassword: 'PATCH /api/auth/update-password'
      },
      products: {
        list: 'GET /api/products',
        detail: 'GET /api/products/:id',
        create: 'POST /api/products (admin only)',
        update: 'PUT /api/products/:id (admin only)',
        delete: 'DELETE /api/products/:id (admin only)'
      },
      cart: {
        get: 'GET /api/cart',
        add: 'POST /api/cart',
        update: 'PUT /api/cart',
        remove: 'DELETE /api/cart/:productId'
<<<<<<< Updated upstream
      }
    },
    sampleData: {
      adminUser: { email: 'admin@example.com', password: 'password123' },
      regularUser: { email: 'user@example.com', password: 'password123' },
      note: 'Sample users will be created automatically on first startup'
    }
  });
=======
      }
    },
    sampleData: {
      adminUser: { email: 'admin@example.com', password: 'password123' },
      regularUser: { email: 'user@example.com', password: 'password123' },
      note: 'Sample users will be created automatically on first startup'
    }
  });
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'A comprehensive E-commerce API with authentication, product management, and shopping cart functionality',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      },
      {
        url: 'https://api.example.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT authorization header using the Bearer scheme. Example: "Bearer {token}"'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT token stored in HTTP-only cookie'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/route/*.js', './src/models/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "E-commerce API Documentation",
  customCss: '.swagger-ui .topbar { display: none }',
}));

// Redirect root to API docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
>>>>>>> Stashed changes
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/dist', 'index.html'));
  });
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableRoutes: [
      'GET /api',
      'GET /api/health',
      'POST /api/auth/signup',
      'POST /api/auth/signin',
      'GET /api/products',
      'GET /api/cart'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// MongoDB Connection
const connectDB = async () => {
  try {
<<<<<<< Updated upstream
    await mongoose.connect(process.env.MONGODB_URI);
=======
    await mongoose.connect(process.env.MONGO_URI);
>>>>>>> Stashed changes
    console.log('✅ MongoDB Connected');
    
    // Create sample data if database is empty
    await createSampleData();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
// Create sample data
const createSampleData = async () => {
  try {
    const User = (await import('./src/models/user.js')).default;
    const Product = (await import('./src/models/product.js')).default;

    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const admin = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created: admin@example.com / password123');
    }

    // Check if regular user exists
    const userExists = await User.findOne({ email: 'user@example.com' });
    if (!userExists) {
      const user = new User({
        username: 'user',
        email: 'user@example.com',
        password: 'password123',
        role: 'user'
      });
      await user.save();
      console.log('✅ Regular user created: user@example.com / password123');
    }

    // Check if products exist
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const sampleProducts = [
        {
          name: 'iPhone 15 Pro',
          description: 'Latest iPhone with advanced features and A17 Pro chip',
          price: 999.99,
          image: 'https://m.media-amazon.com/images/I/71Yp3z87X4L._AC_SX679_.jpg',
          category: 'Electronics',
          stock: 50
        },
        {
          name: 'MacBook Air M3',
          description: 'Powerful laptop with M3 chip and all-day battery life',
          price: 1299.99,
          image: 'https://m.media-amazon.com/images/I/71h-tsPzk5L._AC_SX679_.jpg',
          category: 'Electronics',
          stock: 30
        },
        {
          name: 'AirPods Pro',
          description: 'Wireless earbuds with active noise cancellation',
          price: 249.99,
          image: 'https://m.media-amazon.com/images/I/71Yp3z87X4L._AC_SX679_.jpg',
          category: 'Electronics',
          stock: 100
        },
        {
          name: 'Samsung Galaxy S24',
          description: 'Latest Android flagship with amazing camera capabilities',
          price: 899.99,
          image: 'https://m.media-amazon.com/images/I/71h-tsPzk5L._AC_SX679_.jpg',
          category: 'Electronics',
          stock: 25
        },
        {
          name: 'Sony WH-1000XM5',
          description: 'Premium noise-canceling headphones with superior sound',
          price: 349.99,
          image: 'https://m.media-amazon.com/images/I/71Yp3z87X4L._AC_SX679_.jpg',
          category: 'Electronics',
          stock: 40
        }
      ];

      await Product.insertMany(sampleProducts);
      console.log('✅ Sample products created');
    }

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
};

<<<<<<< Updated upstream
=======



>>>>>>> Stashed changes
// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
<<<<<<< Updated upstream
=======
    console.log(`📚 API documentation: http://localhost:${PORT}/api-docs`);
>>>>>>> Stashed changes
    console.log(`📚 API documentation: http://localhost:${PORT}/api`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️ Database: MongoDB`);
  });
});


