import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/user';

interface authState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
};

const token = localStorage.getItem('token');
const user: User | null = token ? { username: 'mockUser' } : null;


const initialState: authState = {
    user: user,
    isAuthenticated: !!token,
    token: token
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ user: User, token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        }
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;