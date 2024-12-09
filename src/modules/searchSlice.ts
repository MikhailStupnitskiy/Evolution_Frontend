
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cards } from "../modules/MyInterface";

interface SearchState {
    cardName: string;
    filteredCards: Cards[]; // Добавляем состояние для отфильтрованных продуктов
}

const initialState: SearchState = {
    cardName: "",
    filteredCards: [],
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setCardName(state, action: PayloadAction<string>) {
            state.cardName = action.payload;
        },
        setFilteredCards(state, action: PayloadAction<Cards[]>) {
            state.filteredCards = action.payload;
        },
    },
});

export const { setCardName, setFilteredCards } = searchSlice.actions;
export default searchSlice.reducer;
