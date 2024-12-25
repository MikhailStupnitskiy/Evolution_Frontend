
import { createSlice } from "@reduxjs/toolkit";
import { registerUser } from "../thunks/reg";


interface RegState {
    loading: boolean;
    error: string | null;
}

const initialState: RegState = {
    loading: false,
    error: null,
};

const regSlice = createSlice({
    name: "reg",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const regReducer = regSlice.reducer;
