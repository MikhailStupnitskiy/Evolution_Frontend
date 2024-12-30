
import { createSlice, createAsyncThunk, PayloadAction  } from "@reduxjs/toolkit";
import { getMoveByID } from "../ApiCards"; // Подключаем вашу функцию
import { MoveResponse } from "../MyInterface";
import { api } from "../../api";
import { SchemasDeleteCardFromMoveRequest } from "../../api/Api";

export interface BasketState {
    basketData: MoveResponse | null;
    selectedStage: string;
    loading: boolean;
    error: string | null;
}

const initialState: BasketState = {
    basketData: null,
    selectedStage: "",
    loading: false,
    error: null,
};

// Thunk: Загрузка данных корзины
export const fetchBasketData = createAsyncThunk<
    MoveResponse,
    number,
    { rejectValue: string }
>("basket/fetchBasketData", async (id, { rejectWithValue }) => {
    try {
        const data = await getMoveByID(id); // Используем вашу функцию
        console.log(data)
        
        if (!data) {
            return rejectWithValue("Не удалось загрузить данные корзины");
        }
        return data;
    } catch (err: any) {
        return rejectWithValue(err.message || "Ошибка при загрузке корзины");
    }
});



// В basketSlice.ts
export const updateFoodMoveCard = createAsyncThunk<
    { moveId: string; cardId: number; food: number },
    { moveId: string; cardId: number; food: number },
    { rejectValue: string }
>(
    "moveCards/updateFood",
    async ({ moveId, cardId, food }, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return rejectWithValue("Токен не найден.");
        }

        try {
            const response = await api.api.moveCardsUpdate(
                moveId, // ID хода передается как часть пути
                {card_id: cardId, food: food }, // Тело запроса
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                return { moveId, cardId, food };
            } else {
                console.error("Ошибка при обновлении корма:", response);
                return rejectWithValue("Ошибка при обновлении данных.");
            }
        } catch (error) {
            console.error("Произошла ошибка при обновлении карты:", error);
            return rejectWithValue("Ошибка сервера при обновлении карты.");
        }
    }
);




// Thunk: Оформление заявки
export const confirmBasket = createAsyncThunk<void, number, { rejectValue: string }>(
    "basket/confirmBasket",
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Токен не найден");

            await api.api.moveFormUpdate(
                id,
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Ошибка при оформлении заявки");
        }
    }
);

// Thunk: Удаление заявки
export const deleteBasket = createAsyncThunk<void, number, { rejectValue: string }>(
    "basket/deleteBasket",
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Токен не найден");

            await api.api.moveDelete(
                id,
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Ошибка при удалении заявки");
        }
    }
);

// Thunk: Удаление продукта из заявки
export const deleteCardFromBasket = createAsyncThunk<
    number,
    { requestId: number; cardId: number },
    { rejectValue: string }
>("basket/deleteCardFromBasket", async ({ requestId, cardId }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Токен не найден");

        const requestBody: SchemasDeleteCardFromMoveRequest = { card_id: cardId };
        await api.api.moveCardsDelete(requestId.toString(), requestBody, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return cardId; // Возвращаем удалённый mealId для обновления состояния
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Ошибка при удалении карты");
    }
});


export const updateMoveStage = createAsyncThunk<
    { moveId: string; stage: string },
    { moveId: string; stage: string },
    { rejectValue: string }
>(
    "basket/updateMoveStage",
    async ({ moveId, stage }, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return rejectWithValue("Токен не найден.");
        }

        try {
            const response = await api.api.moveUpdate(moveId, {stage}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                return { moveId, stage };
            } else {
                console.error("Ошибка при обновлении стадии:", response);
                return rejectWithValue("Ошибка при обновлении стадии.");
            }
        } catch (error) {
            console.error("Ошибка при обновлении стадии:", error);
            return rejectWithValue("Ошибка сервера при обновлении стадии.");
        }
    }
);



const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        setSelectedStage(state, action: PayloadAction<string>) {
            state.selectedStage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBasketData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBasketData.fulfilled, (state, action) => {
                state.loading = false;
                state.basketData = action.payload;
                console.log(state.basketData)
            })
            .addCase(fetchBasketData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка при загрузке хода";
            })
            .addCase(confirmBasket.rejected, (state, action) => {
                state.error = action.payload || "Ошибка при оформлении заявки";
            })
            .addCase(deleteBasket.rejected, (state, action) => {
                state.error = action.payload || "Ошибка при удалении заявки";
            })

            .addCase(updateMoveStage.fulfilled, (state, action) => {
                if (state.basketData) {
                    state.basketData.stage = action.payload.stage; // Обновляем стадию в состоянии
                    state.selectedStage = action.payload.stage || "";
                    }
            })
            .addCase(updateMoveStage.rejected, (state, action) => {
                state.error = action.payload || "Ошибка при обновлении стадии.";
            })
            

            .addCase(updateFoodMoveCard.fulfilled, (state, action) => {
                if (state.basketData) {
                    const updatedCard = state.basketData.move_cards?.find(
                        (card) => card.card.id === action.payload.cardId
                    );
                    if (updatedCard) {
                        updatedCard.food = action.payload.food; // Обновляем значение food
                    }
                }
            })

            .addCase(deleteCardFromBasket.fulfilled, (state, action) => {
                if (state.basketData) {
                    state.basketData.move_cards = state.basketData.move_cards?.filter(
                        (card) => card.card.id !== action.payload
                    );
                }
            })
            .addCase(deleteCardFromBasket.rejected, (state, action) => {
                state.error = action.payload || "Ошибка при удалении карты";
            });
    },
});


export const { setSelectedStage } = basketSlice.actions;
export default basketSlice.reducer;
