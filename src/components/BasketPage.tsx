import { FC, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./AuthPage.css";
import "./BasketPage.css"; // Подключаем стили корзины
import { HeaderUni } from "./HeaderUni";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { useDispatch, useSelector } from "react-redux";
import { ROUTES } from "../modules/Routes";
import { RootState } from "../modules/store";
import {
    fetchBasketData,
    confirmBasket,
    deleteBasket,
    deleteCardFromBasket,
    updateFoodMoveCard,
     // Новое асинхронное действие для обновления этапа
} from "../modules/slices/basketSlice";
import type { AppDispatch } from '../modules/store';

export const BasketPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { basketData, loading, error } = useSelector((state: RootState) => state.basket);
    
    // Состояние для выбранного этапа
    const [selectedStage, setSelectedStage] = useState<string>("");

    useEffect(() => {
        if (id) {
            dispatch(fetchBasketData(Number(id)));
        }
    }, [id, dispatch]);

    const handleConfirm = () => {
        if (id) dispatch(confirmBasket(Number(id)));
    };

    const handleDeleteBasket = () => {
        if (id) dispatch(deleteBasket(Number(id)));
    };

    const handleDeleteCard = (cardId: number) => {
        if (id) dispatch(deleteCardFromBasket({ requestId: Number(id), cardId }));
    };

    const handleIncreaseFood = (cardId: number, currentFood: number) => {
        if (id) {
            dispatch(updateFoodMoveCard({ moveId: id, cardId, food: currentFood + 1 }));
        }
    };
    
    const handleDecreaseFood = (cardId: number, currentFood: number) => {
        if (id && currentFood > 0) {
            dispatch(updateFoodMoveCard({ moveId: id, cardId, food: currentFood - 1 }));
        }
    };

    if (loading) {
        return <div>Загрузка данных...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <>
            <div className="header-m">
                <HeaderUni />
                <div className="MP_breadcrumbs">
                    <BreadCrumbs 
                        crumbs={[{ label: "Ход"}]} 
                    />
                </div>
            </div> 
            <div className="container-basket">
                {/* Выпадающее меню для выбора этапа */}
                <div className="stage-dropdown">
                    <label htmlFor="stage-select">Выберите этап:</label>
                    <select
                        id="stage-select"
                    >
                        <option value="Развитие">Развитие</option>
                        <option value="Питание">Питание</option>
                        <option value="Вымирание">Вымирание</option>
                    </select>
                </div>


                <div className="basket-cards">
                    {basketData?.move_cards?.map((card) => (
                        <div key={card.card.id} className="basket-card">
                            <img src={card.card.image_url} className="card-image-b" alt="Card Image" />
                            <div className="card-info-b">
                                <h2 className="title-en-b">{card.card.title_en}</h2>
                                <div className="multiplier-info-b">
                                    <h2 className="title-ru-b">{card.card.title_ru}</h2>
                                    <h3 className="multiplier-b">{card.card.multiplier}</h3>
                                </div>
                                <p className="description-b">{card.card.description}</p>
                            </div>
                            <div className="food-control">
                                <button
                                    onClick={() => handleDecreaseFood(card.card.id || 0, card.food)}
                                    className="food-btn decrease-btn"
                                >
                                    -
                                </button>
                                <div className="circle-number">{card.food}</div>
                                <button
                                    onClick={() => handleIncreaseFood(card.card.id || 0, card.food)}
                                    className="food-btn increase-btn"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={() => handleDeleteCard(card.card.id || 0)}
                                className="delete-product-btn"
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                </div>
                <div className="basket-summary">
                    <Link to={ROUTES.HOME} className="no-underline">
                        <div className="basket-actions">
                            <button onClick={handleConfirm} className="action-btn confirm-btn">
                                Оформить заявку
                            </button>
                            <button onClick={handleDeleteBasket} className="action-btn delete-btn">
                                Удалить заявку
                            </button>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
};
