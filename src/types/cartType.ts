import type { Product } from './product';

interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    totalPrice: number;
    totalQuantity: number;
}

export type { CartItem, CartState };