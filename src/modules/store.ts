import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "../modules/searchSlice"; // Импортируйте ваш searchSlice
import { authReducer } from "./slices/authSlice";
import {regReducer} from "./slices/regSlice"
import { requestsReducer } from "./slices/allReqsSlice";
import basketReducer from "./slices/basketSlice";

export const store = configureStore({
    reducer: {
        search: searchReducer, // Добавьте редьюсер поисковой строки
        auth: authReducer,
        reg: regReducer,
        requests: requestsReducer,
        basket: basketReducer,
    },
});

// Тип для состояния приложения
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;