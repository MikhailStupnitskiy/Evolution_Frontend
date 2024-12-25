
import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

interface LoginPayload {
  login: string;
  password: string;
}

interface LoginUserResponse {
  token: string;
}

export const loginUser = createAsyncThunk<LoginUserResponse, LoginPayload>(
  'auth/loginUser',
  async ({ login, password }, { rejectWithValue }) => {
    try {
      const response = await api.api.loginUserCreate({ login, password });
      return response.data as LoginUserResponse;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Authorization error');
    }
  }
);