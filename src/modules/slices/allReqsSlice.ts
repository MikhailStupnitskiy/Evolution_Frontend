import { createSlice } from "@reduxjs/toolkit";
import { DsMoves } from "../../api/Api";
import { fetchRequestsThunk } from "../thunks/allReqs";



interface RequestsState {
    requests: DsMoves[];
    loading: boolean;
    error: string | null;
}

const initialState: RequestsState = {
    requests: [],
    loading: false,
    error: null,
};

const requestsSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequestsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRequestsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.requests = action.payload;
            })
            .addCase(fetchRequestsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Неизвестная ошибка";
            });
    },
});

export const requestsReducer = requestsSlice.reducer;