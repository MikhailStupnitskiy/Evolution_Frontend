
import { createAsyncThunk } from "@reduxjs/toolkit";
import { DsMoves } from "../../api/Api";
import { api } from "../../api";



// Thunk для получения заявок
export const fetchRequestsThunk = createAsyncThunk<DsMoves[], void, { rejectValue: string }>(
    "requests/fetchRequests",
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return rejectWithValue("Токен не найден.");
        }

        try {
            const response = await api.api.moveList(
                { status: 1 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data["Moves"] || [];
        } catch (error) {
            console.error("Ошибка при загрузке заявок:", error);
            return rejectWithValue("Произошла ошибка при загрузке заявок.");
        }
    }
);
