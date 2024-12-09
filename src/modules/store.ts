import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "../modules/searchSlice"; // Импортируйте ваш searchSlice
export const store = configureStore({
    reducer: {
        search: searchReducer, // Добавьте редьюсер поисковой строки
    },
});

// Тип для состояния приложения
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;