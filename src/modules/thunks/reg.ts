
// registerThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

interface RegisterPayload {
  login: string;
  password: string;
}

interface RegisterUserResponse {
  message: string;
}

export const registerUser = createAsyncThunk<RegisterUserResponse, RegisterPayload>(
  'auth/registerUser',
  async ({ login, password }, { rejectWithValue }) => {
    try {
      const response = await api.api.registerUserCreate({ login, password });
      return response.data as RegisterUserResponse;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Registration error');
    }
  }
);
