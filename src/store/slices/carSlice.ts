import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {Product} from '../../types/product';

interface CarItem extends Product {
    quantity: number;
}

interface CarState{
    items:CarItem[];
    totalPrice:number;
    totalQuantity:number;
}

const initialState:CarState={
    items:[],
    totalPrice:0,
    totalQuantity:0,  
}

const carSlice = createSlice({
    name:'car',
    initialState:initialState,
    reducers:{
        addToCar:(state,action:PayloadAction<Product>)=>{
            const existingItem = state.items.find(item=>item.id===action.payload.id);
            if(existingItem){
                existingItem.quantity ++;
            }
            else{
                state.items.push({...action.payload, quantity: 1});
            }
            state.totalPrice += action.payload.price;
            state.totalQuantity++;
        },
        minusFromCar:(state,action:PayloadAction<Product>)=>{
            const existingItem = state.items.find(item=>item.id===action.payload.id);
            if(existingItem&&existingItem.quantity>1){
                existingItem.quantity--;
                state.totalPrice -= existingItem.price;
                state.totalQuantity--;
            }
            else if(existingItem){
                state.totalPrice -= existingItem.price;
                state.totalQuantity -= 1;
                const index = state.items.findIndex(item=>item.id===action.payload.id);
                state.items.splice(index, 1);
            }
        },
        removeFromCar:(state,action:PayloadAction<Product>)=>{
            const index = state.items.findIndex(item=>item.id===action.payload.id);
            if(index!==-1){
                state.totalPrice -= state.items[index].price * state.items[index].quantity;
                state.totalQuantity -= state.items[index].quantity;
                state.items.splice(index, 1);
            }
        },
        clearCar:(state)=>{
            state.items=[];
            state.totalPrice=0;
            state.totalQuantity=0;
        }
    }
})

export const {addToCar,minusFromCar,removeFromCar,clearCar} = carSlice.actions;

export default carSlice.reducer;