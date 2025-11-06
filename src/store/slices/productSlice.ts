import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Product } from '../../types/product';
import { mockProducts } from '../../mocks/products';
// import request from '../../utils/request';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        // const response = await request.get<Product[]>('api/products');
        // return response.data;
        return mockProducts;
    }
);

interface productState {
    products: Product[];
    state: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: productState = {
    products: [],
    state: 'idle',
    error: null,
}

const productSlice = createSlice({
    name: 'products',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.state = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.state = 'succeeded';
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.state = 'failed';
                state.error = action.error.message || 'Failed to fetch products';
            })
    }
});


export default productSlice.reducer;