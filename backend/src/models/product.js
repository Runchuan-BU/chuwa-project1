// models/product.js
import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

//insert data to mongodb

// import User from './user.js';
// import dotenv from 'dotenv';
//  dotenv.config();
 
// const uri = process.env.MONGO_URI;

// const sampleProducts = [
//   {
//     title: 'Apple iPhone 14',
//     description: 'Latest Apple smartphone with A15 chip and amazing camera',
//     price: 999,
//     imageUrl: 'https://unsplash.com/photos/space-gray-iphone-6-on-white-textile-8l9VxXI28tY',
//   },
//   {
//     title: 'Sony WH-1000XM5',
//     description: 'Best noise-canceling headphones in the market',
//     price: 349,
//     imageUrl: 'https://unsplash.com/photos/a-pair-of-headphones-sitting-on-top-of-each-other-A6hzRnwR3vM',
//   },
//   {
//     title: 'MacBook Pro 14"',
//     description: 'High-performance laptop for professionals',
//     price: 1999,
//     imageUrl: 'https://unsplash.com/photos/silver-macbook-on-white-table-Hin-rzhOdWs',
//   }
// ];

// async function seedProducts() {
//   try {
//     await mongoose.connect(uri);
//     console.log('✅ Connected to MongoDB');

//     const user = await User.create({
//     username: "demoAdmin",
//     email: "demoAdmin@example.com",
//     password: "password123",
//     role: "admin",
//   });

//     const productsWithUser = sampleProducts.map((product) => ({
//       ...product,
//       createdBy: user._id
//     }));

//     await Product.insertMany(productsWithUser);

//     console.log('✅ Products seeded successfully');

//     await mongoose.disconnect();
//     console.log('Disconnected from MongoDB');
//   } catch (err) {
//     console.error('❌ Error seeding products:', err.message);
//   }
// }

// seedProducts();


export default Product;