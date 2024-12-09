
import { Cards, ApiResponse } from "./MyInterface";
import { MOCK_DATA_CARDS } from "./MockDataCards";

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

export const getAllCards = async (): Promise<ApiResponse> => {
    try {
        const response = await fetch(`/api/cards`);
        const info = await response.json();
        console.log(info);
        return { Cards: info["cards"]};
    } catch (error) {
        console.error("Ошибка при получении данных из API, используем MOCK_DATA_PRODUCTS", error);
        return {Cards: MOCK_DATA_CARDS.Cards};
    }
};
