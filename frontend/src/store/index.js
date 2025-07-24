import { configureStore } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from '../api/client';

// Helper function to load state from localStorage
const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Helper function to save state to localStorage
const saveToLocalStorage = (key, state) => {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // If user already exists and is authenticated, return it immediately
      if (auth.user && auth.isAuthenticated && auth.token) {
        console.log('User profile already available, using cached data');
        return auth.user;
      }
      
      // If has token but no user, fetch from API
      if (auth.token && auth.isAuthenticated) {
        console.log('Fetching user profile from API...');
        const response = await client.get('/auth/profile');
        console.log('User profile fetched successfully');
        return response.data.user;
      }
      
      // If no authentication, throw error
      throw new Error('No authentication token available');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch user profile');
    }
  }
);

// Cart async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        throw new Error('User must be logged in to access cart');
      }
      
      const response = await client.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch cart');
    }
  }
);

export const addToCartAPI = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, name, price, image, quantity }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        throw new Error('User must be logged in to add items to cart');
      }
      
      const response = await client.post('/cart', {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartItemAPI = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.isAuthenticated || !auth.token) {
        throw new Error('User must be logged in to update cart');
      }
      
      console.log('updateCartItemAPI - sending request with:', { productId, quantity });
      console.log('updateCartItemAPI - auth token exists:', !!auth.token);
      
      const response = await client.put('/cart', {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCartAPI = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.isAuthenticated || !auth.token) {
        throw new Error('User must be logged in to remove items from cart');
      }
      
      console.log('removeFromCartAPI - removing productId:', productId);
      console.log('removeFromCartAPI - auth token exists:', !!auth.token);
      
      const response = await client.delete(`/cart/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to remove item from cart');
    }
  }
);

// User Slice
const initialUserState = {
  userInfo: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setUserInfo, logout } = userSlice.actions;
const userReducer = userSlice.reducer;

// Product Slice
const initialProductState = {
  items: [],
  isLoading: false,
  error: null,
  selectedProduct: null,
};

const productSlice = createSlice({
  name: "products",
  initialState: initialProductState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    addProduct: (state, action) => {
      state.items.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { 
  setProducts, 
  setSelectedProduct, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  setLoading, 
  setError 
} = productSlice.actions;
const productReducer = productSlice.reducer;

// Cart Slice - Refactored for server integration
const initialCartState = {
  items: [],
  total: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    clearCartLocal: (state) => {
      state.items = [];
      state.total = 0;
      state.error = null;
    },
    setCartError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Add to Cart
      .addCase(addToCartAPI.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.error = null;
      })
      .addCase(addToCartAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Cart Item
      .addCase(updateCartItemAPI.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItemAPI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.error = null;
      })
      .addCase(updateCartItemAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Remove from Cart
      .addCase(removeFromCartAPI.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.error = null;
      })
      .addCase(removeFromCartAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartLocal, setCartError } = cartSlice.actions;
const cartReducer = cartSlice.reducer;

// Auth Slice
const initialAuthState = {
  user: loadFromLocalStorage('user', null),
  token: localStorage.getItem('token'), 
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'), 
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      
      // Save to localStorage
      saveToLocalStorage('user', action.payload.user);
      localStorage.setItem('token', action.payload.token); // Save token directly without JSON.stringify
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    initializeAuth: (state) => {
      // Initialize from localStorage
      const token = localStorage.getItem('token'); 
      const user = loadFromLocalStorage('user', null);
      
      if (token && user) {
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          saveToLocalStorage('user', action.payload);
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        // Don't show error if user data already exists
        if (!state.user) {
          state.error = action.payload;
        }
        console.log('User profile fetch failed, using existing data if available');
      });
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout: authLogout, 
  initializeAuth
} = authSlice.actions;
const authReducer = authSlice.reducer;

// Store Configuration
const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});

// Initialize auth state from localStorage when store is created
store.dispatch(initializeAuth());

export default store;

