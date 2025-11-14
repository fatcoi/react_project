import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Product } from '../../types/product';
import request from '../../utils/request';
import type{RootState} from '../';

interface ProductResponse {
    products: Product[];
    currentPage: number;
    totalPages: number;
}

interface productState {
    products: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentPage: number;
    totalPages: number;
    limit:number;
}

const initialState: productState = {
    products: [],
    status: 'idle',
    error: null,
    currentPage: 1,
    totalPages: 1,
    limit:8
}

export const firstPageProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_,{getState}) => {
        const state = getState() as RootState;
        const response = await request.get<ProductResponse>('/products', {
            params: {
                page: 1,
                limit: state.products.limit
            }
        });
        return response.data;
    }
);

//交互要控制currentpage===totalpage时，禁止点击下一页
export const nextPageProducts = createAsyncThunk(
    'products/nextPageProducts',
    async (_,  {getState }) => {
        const state = getState() as RootState;
        const nextPage = state.products.currentPage + 1;
        const response = await request.get<ProductResponse>('/products', {
            params: {
                page: nextPage,
                limit: state.products.limit
            }
        });
        return response.data;
    }
);

//交互要控制currentpage===1时，禁止点击上一页
export const prevPageProducts = createAsyncThunk(
    'products/prevPageProducts',
    async (_ , {getState})=>{
        const state = getState() as RootState;
        const prevPage = state.products.currentPage - 1;
        const response = await request.get<ProductResponse>('/products', {
            params: {
                page: prevPage,
                limit: state.products.limit
            }
        });
        return response.data;
    }
)

export const lastPageProducts = createAsyncThunk(
    'products/getLastPageProducts',
    async (_ , {getState})=>{
        const state = getState() as RootState;
        const lastPage = state.products.totalPages;
        const response = await request.get<ProductResponse>('/products', {
            params: {
                page: lastPage,
                limit: state.products.limit
            }
        });
        return response.data;
    }
)

const productSlice = createSlice({
    name: 'products',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(firstPageProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(firstPageProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload.products;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(firstPageProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch products';
            })
            .addCase(nextPageProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload.products;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(prevPageProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload.products;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(lastPageProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload.products;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(nextPageProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch products';
            }
            )
            .addCase(prevPageProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch products';
            }
            )
            .addCase(lastPageProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch products';
            })
            .addCase(lastPageProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(nextPageProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(prevPageProducts.pending, (state) => {
                state.status = 'loading';
            })
    }
});


export default productSlice.reducer;