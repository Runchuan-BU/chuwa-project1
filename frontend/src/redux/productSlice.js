// 商品資料

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../client';

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const res = await client.get('/products');
  return res.data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export default productSlice.reducer;
