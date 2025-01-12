
import { Cards, ApiResponse, ApiResponseGetAllCards } from "./MyInterface";
import { MOCK_DATA_CARDS } from "./MockDataCards";
import { api } from '../api';  // Путь к сгенерированному Api
import { MoveResponse, Move } from "./MyInterface";
import { SchemasInfoForMove } from "../api/Api";

export const getCardsByName = async (name: string): Promise<ApiResponse> => {
    try {

        const response = await fetch(`/api/card_by_name/${name}`);
        const info = await response.json();
        console.log(info);
        return { Cards: info["cards"]};
      } 


    catch (error) {
        console.error("Ошибка при получении данных из API, используем MOCK_DATA_CARDS", error);

        // Фильтрация MOCK_DATA_CARDS по title_en
        const filteredProducts = MOCK_DATA_CARDS.Cards.filter(card =>
            card.title_en.toLowerCase().includes(name.toLowerCase())
        );

        return {Cards: filteredProducts };
    }
};

export const getCardByID = async (
    id: string | number
): Promise<Cards> => {
    try {
        const response = await fetch(`/api/card/${id}`);
        const info = await response.json();
        console.log(info);
        return info["card"];

    } catch (error) {
        console.error("Ошибка при получении продукта по ID, используем MOCK_DATA_CARDS", error);
        const cardIndex = Number(id) - 1;
        return MOCK_DATA_CARDS.Cards[cardIndex] || null;
    }
};

export const getAllCards = async (
    limit: number, 
    offset: number
): Promise<ApiResponseGetAllCards> => {
    try {
        const token = localStorage.getItem("token");

        // Формируем заголовки
        const headers: HeadersInit = token
            ? { Authorization: `Bearer ${token}` }
            : {};

        // Формируем URL с параметрами limit и offset
        const url = `/api/cards?limit=${limit}&offset=${offset}`;

        const response = await fetch(url, {
            method: "GET",
            headers, // Передаем заголовки
        });

        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }

        const info = await response.json();
        console.log(info);
        return {
            Cards: info["cards"],
            MoveID: info["move_ID"],
            CardsInMoveCount: info["count"],
        };
    } catch (error) {
        console.error(
            "Ошибка при получении данных из API, используем MOCK_DATA_CARDS",
            error
        );
        return {
            Cards: MOCK_DATA_CARDS.Cards,
            MoveID: 0,
            CardsInMoveCount: 0,
        };
    }
};


function toMove(moveData?: Record<string, any>): Move {
    return {
        id: moveData?.ID,
        status: moveData?.Status,
        date_create: moveData?.DateCreate,
        date_update: moveData?.DateUpdate,
        date_finish: moveData?.DateFinish,
        creator_id: moveData?.CreatorID,
        Creator: moveData?.CreatorLogin,
        Moderator: moveData?.Moderator,
        player: moveData?.Player,
        stage: moveData?.Stage,
        cube: moveData?.Cube,
    };
}

export const getMoveByID = async (id: number): Promise<MoveResponse | null> => {
    const token = localStorage.getItem("token"); // Получение токена из localStorage
    if (!token) {
        console.error("Токен отсутствует. Авторизация не выполнена.");
        return null;
    }

    try {
        // Выполнение запроса к API
        const response = await api.api.moveDetail(id, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(response.data.moves)
        // Проверка наличия данных в ответе
        if (response.data) {
            return {
                moves: toMove(response.data.moves)    || {}, // Убедиться, что "moves" существует
                
                status: response.data.status,
                move_cards: response.data.move_cards?.map((item: SchemasInfoForMove) => ({
                    card: item.card || {},
                    food: item.food || 0,
                })) || [], // Преобразование move_cards в требуемую структуру
            };
        } else {
            console.error("Данные отсутствуют в ответе.");
            return null;
        }
    } catch (err: any) {
        // Обработка ошибок
        if (err.response?.data?.error) {
            console.error("Ошибка API:", err.response.data.error);
        } else {
            console.error("Произошла ошибка при выполнении запроса:", err);
        }
        return null;
    }
};