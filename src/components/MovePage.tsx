import { FC, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./AuthPage.css";
import "./MovePage.css"; // Подключаем стили корзины
import { HeaderUni } from "./HeaderUni";
import { BreadCrumbs } from "./BreadCrumbs";
import { useDispatch, useSelector } from "react-redux";
import { ROUTES } from "../modules/Routes";
import { RootState } from "../modules/store";
import {
    fetchBasketData,
    confirmBasket,
    deleteBasket,
    deleteCardFromBasket,
    updateFoodMoveCard,
    updateMoveStage,
     // Новое асинхронное действие для обновления этапа
} from "../modules/slices/moveSlice";
import type { store } from '../modules/store';

export const BasketPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    type AppDispatch = typeof store.dispatch;
    const dispatch = useDispatch<AppDispatch>();
    const { basketData, loading, error } = useSelector((state: RootState) => state.basket);
    
    const [selectedStage, setSelectedStage] = useState<string>("");

    useEffect(() => {
        if (id) {
            dispatch(fetchBasketData(Number(id)));
        }
    }, [id, dispatch]);

    const handleConfirm = () => {
        if (selectedStage != "" && id) dispatch(confirmBasket(Number(id)));
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

    const handleStageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStage = event.target.value;
        setSelectedStage(newStage);

        if (id && newStage !== "Выберите..") {
            dispatch(updateMoveStage({ moveId: id, stage: newStage }));
        }
    };

    const Status = basketData?.status

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
                {!Status && (
                    <div className="stage-dropdown">
                        <label htmlFor="stage-select">Выберите этап:</label>
                        <select
                            id="stage-select"
                            value={selectedStage}
                            onChange={handleStageChange}
                        >
                            <option value=""></option>
                            <option value="Развитие">Развитие</option>
                            <option value="Питание">Питание</option>
                            <option value="Вымирание">Вымирание</option>
                        </select>
                    </div>
                )}
                {(Status != 0) && (
                    <div>
                        <h2>Кубик: {basketData?.moves.cube}</h2>
                        <h2>Стадия: {basketData?.moves.stage}</h2>
                    </div>
                )}

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
                                {!Status && (<button
                                    onClick={() => handleDecreaseFood(card.card.id || 0, card.food)}
                                    className="food-btn decrease-btn"
                                >
                                    -
                                </button>)}
                                <div className="circle-number">{card.food}</div>
                                {!Status && (<button
                                    onClick={() => handleIncreaseFood(card.card.id || 0, card.food)}
                                    className="food-btn increase-btn"
                                >
                                    +
                                </button>)}
                            </div>
                            {!Status && (<button
                                onClick={() => handleDeleteCard(card.card.id || 0)}
                                className="delete-product-btn"
                            >
                                Удалить
                            </button>)}
                        </div>
                    ))}
                </div>

                <div className="basket-summary">
                    {!Status && (<Link to={ROUTES.HOME} className="no-underline">
                    <div className="basket-actions">
                            <button onClick={() => {handleConfirm()}} className="action-btn confirm-btn">
                                Оформить ход
                            </button>
                            <button onClick={handleDeleteBasket} className="action-btn delete-btn">
                                Удалить ход
                            </button>
                        </div>
                    </Link>)}
                </div>
            </div>
        </>
    );
};
