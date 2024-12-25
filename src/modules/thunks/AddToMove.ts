import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { SchemasAddCardToMoveResponse } from '../../api/Api';

// Интерфейс для входных параметров
interface AddCardPayload {
    cardId: string;
    token?: string;
  }
  
  // Интерфейс для ответа
  export interface SchemasAddCardToMove {
    success?: boolean;
    message?: string;
  }
  
  export const addCardToMove = createAsyncThunk<
    SchemasAddCardToMoveResponse,  // Тип ответа
    AddCardPayload,                   // Тип входных параметров
    { rejectValue: string }            // Тип ошибок
  >(
    'card/addToMove',
    async ({ cardId, token }, { rejectWithValue }) => {
      try {
        const response = await api.api.cardToMoveCreate(cardId, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data as SchemasAddCardToMoveResponse;
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Ошибка при добавлении карты');
      }
    }
  );