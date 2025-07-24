import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Product description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be a positive number']
  },
  image: {
    type: String,
    required: [true, 'Product image URL is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Other'],
      message: 'Invalid category'
    },
    default: 'Other'
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ name: 'text', description: 'text' });

// Static method to validate product data
productSchema.statics.validateProduct = function(productData) {
  const errors = [];

  if (!productData.name || productData.name.trim().length === 0) {
    errors.push('Product name is required');
  }

  if (!productData.description || productData.description.trim().length === 0) {
    errors.push('Product description is required');
  }

  if (!productData.price || productData.price <= 0) {
    errors.push('Product price must be greater than 0');
  }

  if (!productData.image || productData.image.trim().length === 0) {
    errors.push('Product image URL is required');
  }

  if (productData.stock < 0) {
    errors.push('Product stock cannot be negative');
  }

  const validCategories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Other'];
  if (!validCategories.includes(productData.category)) {
    errors.push('Invalid product category');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Static method for paginated search
productSchema.statics.findWithPagination = async function(options = {}) {
  const {
    page = 1,
    limit = 10,
    search = '',
    category = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  // Build query
  let query = {};

  // Search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Category filter
  if (category && category !== 'all') {
    query.category = category;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  
  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Execute query - removed .lean() to allow toJSON transformation
  const [products, total] = await Promise.all([
    this.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    this.countDocuments(query)
  ]);

  const pages = Math.ceil(total / limit);

  return {
    data: products,
    total,
    pages,
    currentPage: parseInt(page),
    hasNext: page < pages,
    hasPrev: page > 1
  };
};

// Instance method to update stock
productSchema.methods.updateStock = function(quantity) {
  if (this.stock + quantity < 0) {
    throw new Error('Insufficient stock');
  }
  this.stock += quantity;
  return this.save();
};

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Transform toJSON to include virtuals and format id
productSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;