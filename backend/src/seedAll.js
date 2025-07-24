//for insert sample to database
//DON'T TOUCH!!!



// import mongoose from 'mongoose';
// import User from './models/user.js';
// import Product from './models/product.js';
// import PromoCode from './models/promoCode.js';
// import Cart from './models/cart.js';
// import dotenv from 'dotenv';

// dotenv.config();

// // Sample data
// const sampleUsers = [
//   {
//     username: 'admin',
//     email: 'admin@example.com',
//     password: 'admin123',
//     role: 'admin'
//   },
//   {
//     username: 'john_doe',
//     email: 'john@example.com',
//     password: 'password123',
//     role: 'user'
//   },
//   {
//     username: 'jane_smith',
//     email: 'jane@example.com',
//     password: 'password123',
//     role: 'user'
//   },
//   {
//     username: 'test_user',
//     email: 'test@example.com',
//     password: 'password123',
//     role: 'user'
//   }
// ];

// const sampleProducts = [
//   {
//     title: 'iPhone 15 Pro',
//     description: 'Latest Apple smartphone with titanium design and A17 Pro chip',
//     price: 999,
//     imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569'
//   },
//   {
//     title: 'MacBook Pro 16"',
//     description: 'Powerful laptop with M3 Max chip for professionals',
//     price: 2499,
//     imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8'
//   },
//   {
//     title: 'AirPods Pro',
//     description: 'Wireless earbuds with active noise cancellation',
//     price: 249,
//     imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434'
//   },
//   {
//     title: 'iPad Air',
//     description: '10.9-inch tablet with M1 chip',
//     price: 599,
//     imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0'
//   },
//   {
//     title: 'Apple Watch Series 9',
//     description: 'Advanced health and fitness tracker',
//     price: 399,
//     imageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9'
//   },
//   {
//     title: 'Sony WH-1000XM5',
//     description: 'Premium noise-canceling headphones',
//     price: 349,
//     imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b'
//   },
//   {
//     title: 'Samsung Galaxy S24 Ultra',
//     description: 'Android flagship with S Pen and AI features',
//     price: 1199,
//     imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c'
//   },
//   {
//     title: 'Nintendo Switch OLED',
//     description: 'Hybrid gaming console with vibrant OLED screen',
//     price: 349,
//     imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e'
//   }
// ];

// const samplePromoCodes = [
//   {
//     code: 'WELCOME10',
//     discountPercent: 10,
//     expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
//   },
//   {
//     code: 'SUMMER20',
//     discountPercent: 20,
//     expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days
//   },
//   {
//     code: 'FLASH50',
//     discountPercent: 50,
//     expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
//   },
//   {
//     code: 'VIP30',
//     discountPercent: 30,
//     expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 180 days
//   }
// ];

// async function seedAll() {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('✅ Connected to MongoDB');

//     // Clear all collections
//     console.log('\n🗑️  Clearing existing data...');
//     await User.deleteMany({});
//     await Product.deleteMany({});
//     await PromoCode.deleteMany({});
//     await Cart.deleteMany({});
//     console.log('✅ All collections cleared');

//     // Seed Users
//     console.log('\n👥 Seeding Users...');
//     const users = await User.create(sampleUsers);
//     console.log(`✅ Created ${users.length} users`);
//     users.forEach(user => {
//       console.log(`   - ${user.username} (${user.email}) - ${user.role}`);
//     });

//     // Seed Products (using admin user as creator)
//     console.log('\n📦 Seeding Products...');
//     const adminUser = users.find(u => u.role === 'admin');
//     const productsWithCreator = sampleProducts.map(product => ({
//       ...product,
//       createdBy: adminUser._id
//     }));
//     const products = await Product.create(productsWithCreator);
//     console.log(`✅ Created ${products.length} products`);
//     products.forEach(product => {
//       console.log(`   - ${product.title} - $${product.price}`);
//     });

//     // Seed Promo Codes
//     console.log('\n🎟️  Seeding Promo Codes...');
//     const promoCodes = await PromoCode.create(samplePromoCodes);
//     console.log(`✅ Created ${promoCodes.length} promo codes`);
//     promoCodes.forEach(code => {
//       console.log(`   - ${code.code}: ${code.discountPercent}% off (expires: ${code.expiresAt.toLocaleDateString()})`);
//     });

//     // Seed Carts
//     console.log('\n🛒 Seeding Carts...');
//     const regularUsers = users.filter(u => u.role === 'user');
    
//     // Cart 1: John's cart with promo code
//     const cart1 = new Cart({
//       user: regularUsers[0]._id,
//       items: [
//         { product: products[0]._id, quantity: 1 },
//         { product: products[2]._id, quantity: 2 }
//       ],
//       promoCode: 'WELCOME10',
//       discountPercent: 10
//     });
//     await cart1.populate('items.product');
//     cart1.calculateTotals();
//     await cart1.save();

//     // Cart 2: Jane's cart without promo code
//     const cart2 = new Cart({
//       user: regularUsers[1]._id,
//       items: [
//         { product: products[1]._id, quantity: 1 },
//         { product: products[3]._id, quantity: 1 },
//         { product: products[5]._id, quantity: 1 }
//       ]
//     });
//     await cart2.populate('items.product');
//     cart2.calculateTotals();
//     await cart2.save();

//     // Cart 3: Test user's cart
//     const cart3 = new Cart({
//       user: regularUsers[2]._id,
//       items: [
//         { product: products[6]._id, quantity: 1 }
//       ]
//     });
//     await cart3.populate('items.product');
//     cart3.calculateTotals();
//     await cart3.save();

//     console.log('✅ Created 3 sample carts');

//     // Display summary
//     console.log('\n📊 Database Summary:');
//     console.log(`   - Users: ${users.length}`);
//     console.log(`   - Products: ${products.length}`);
//     console.log(`   - Promo Codes: ${promoCodes.length}`);
//     console.log(`   - Carts: 3`);

//     // Test credentials
//     console.log('\n🔑 Test Credentials:');
//     console.log('   Admin:');
//     console.log('     Email: admin@example.com');
//     console.log('     Password: admin123');
//     console.log('   Regular Users:');
//     console.log('     Email: john@example.com / jane@example.com / test@example.com');
//     console.log('     Password: password123');

//     console.log('\n🎟️  Active Promo Codes:');
//     promoCodes.forEach(code => {
//       console.log(`   ${code.code} - ${code.discountPercent}% off`);
//     });

//     await mongoose.disconnect();
//     console.log('\n✅ All seeding completed successfully!');
//   } catch (err) {
//     console.error('❌ Error during seeding:', err);
//     process.exit(1);
//   }
// }

// // Run the seeder
// seedAll();