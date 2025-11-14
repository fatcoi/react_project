import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/user';
import request from '../../utils/request';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';

interface authState {
    user: User | null;
    isAuthenticated: boolean;
};

const token = localStorage.getItem('token');
const user = token ? JSON.parse(localStorage.getItem('user') || 'null') : null;

const initialState: authState = {
    user: user,
    isAuthenticated: !!token,
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }: { username: string, password: string }) => {
        const response = await request.post<{ user: User, token: string }>('/auth/login',{username, password})
        return response.data;
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        await request.post<null>('/auth/logout');
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User, token: string }>) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(login.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                message.error('登录失败，请检查用户名和密码！');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            })
    }
});

export default authSlice.reducer;