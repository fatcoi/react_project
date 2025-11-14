import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, CartState } from '../../types/cartType.ts';
import request from '../../utils/request';
import { createAsyncThunk } from '@reduxjs/toolkit';

const initialState: CartState = {
    items: [],
    totalPrice: 0,
    totalQuantity: 0,
}

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async () => {
        const response = await request.get<CartState>('cart');
        return response.data;
    }
)

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (id: string) => {
        const response = await request.post<CartItem>('cart/add', { id })
        return response.data;
    }
)

export const minusFromCart = createAsyncThunk(
    'cart/minusFromCart',
    async (id: string) => {
        const response = await request.post<CartItem>('cart/minus', {id})
        return response.data;
    }
)

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (id: string) => {
        const response = await request.post<CartItem>('cart/remove',{id})
        return response.data;
    }
)

export const setQuantity = createAsyncThunk(
    'cart/setQuantity',
    async ({ id, quantity }: { id: string, quantity: number }) => {
        const response = await request.post<CartItem>('cart/setQuantity', { id, quantity })
        return response.data;
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async () => {
        await request.post<null>('cart/clear');

    }
)

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartState>) => {
                state.items = action.payload.items;
                state.totalPrice = action.payload.totalPrice;
                state.totalQuantity = action.payload.totalQuantity;
            })
            .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
                const existingItem = state.items.find(item => item.id === action.payload.id);
                if (existingItem) {
                    existingItem.quantity = action.payload.quantity;
                }
                else {
                    state.items.push({ ...action.payload });
                }
                state.totalPrice += action.payload.price;
                state.totalQuantity++;
            })
            .addCase(minusFromCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
                //交互页面要控制商品数量至少为1
                const existingItem = state.items.find(item => item.id === action.payload.id);
                if (existingItem) {
                    existingItem.quantity = action.payload.quantity;
                }
                state.totalPrice -= action.payload.price;
                state.totalQuantity--;
            })
            .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
                const existingItem = state.items.find(item => item.id === action.payload.id);
                if (existingItem) {
                    state.totalPrice -= existingItem.price * existingItem.quantity;
                    state.totalQuantity -= existingItem.quantity;
                    const index = state.items.findIndex(item => item.id === action.payload.id);
                    state.items.splice(index, 1);
                }
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
                state.totalPrice = 0;
                state.totalQuantity = 0;
            })
            .addCase(setQuantity.fulfilled, (state, action: PayloadAction<CartItem>) => {
                const existingItem = state.items.find(item => item.id === action.payload.id);
                if (existingItem) {
                    const quantityDifference = action.payload.quantity - existingItem.quantity;
                    existingItem.quantity = action.payload.quantity;
                    state.totalPrice += existingItem.price * quantityDifference;
                    state.totalQuantity += quantityDifference;
                }
                else {
                    state.items.push({...action.payload });
                    state.totalQuantity += action.payload.quantity;
                    state.totalPrice += action.payload.price * action.payload.quantity;
                }
            })
    }

})

export default cartSlice.reducer;