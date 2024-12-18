import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AuthPage.css";
import "./BasketPage.css"; // Подключаем стили корзины
import { HeaderUni } from "./HeaderUni";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { MoveResponse } from "../modules/MyInterface";
import { getCardByID } from "../modules/ApiCards";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../modules/Routes";
import { api } from '../api';  // Путь к сгенерированному Api
import { SchemasDeleteCardFromMoveRequest } from "../api/Api";

export const BasketPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const [basketData, setBasketData] = useState<MoveResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchBasketData = async () => {
            if (!id) {
                setError("ID заявки отсутствует в URL.");
                setLoading(false);
                return;
            }

            try {
                const data = await getMoveByID(parseInt(id));
                console.log("Данные, полученные от нашего API по заявке", data);
                if (data) {
                    setBasketData(data);
                } else {
                    setError("Не удалось получить данные корзины.");
                }
            } catch (err) {
                console.error("Ошибка при загрузке данных корзины:", err);
                setError("Произошла ошибка при загрузке данных.");
            } finally {
                setLoading(false);
            }
        };

        fetchBasketData();
    }, [id]);

    // Получаем токен из localStorage
    const token = localStorage.getItem('token');

    // Обработчик оформления заявки
    const handleConfirm = async () => {
        try {
            // Вызовите метод API для оформления заявки с Bearer Auth
            await api.api.moveFormUpdate(id!, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // После успешного выполнения запроса, перенаправим на домашнюю страницу
            navigate(ROUTES.HOME);
        } catch (err) {
            console.error("Ошибка при оформлении заявки:", err);
            alert("Произошла ошибка при оформлении заявки.");
        }
    };

    // Обработчик удаления заявки
    const handleDeleteBasket = async () => {
        try {
            // Вызовите метод API для удаления заявки с Bearer Auth
            await api.api.moveDelete(id!, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // После успешного выполнения запроса, перенаправим на домашнюю страницу
            navigate(ROUTES.HOME);
        } catch (err) {
            console.error("Ошибка при удалении заявки:", err);
            alert("Произошла ошибка при удалении заявки.");
        }
    };

    // Обработчик удаления блюда
    const handleDeleteCard = async (cardId: number) => {
        try {
            const requestBody: SchemasDeleteCardFromMoveRequest = {
                card_id: cardId,
            };
            // Вызовите метод API для удаления блюда с Bearer Auth
            await api.api.moveCardsDelete(id!, requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // После успешного удаления блюда обновим корзину
            setBasketData((prevData) => {
                if (prevData) {
                    const updatedCards = prevData.CardsMoves.filter(card => card.id !== cardId);
                    return { ...prevData, CardsMoves: updatedCards };
                }
                return prevData;
            });

            alert("Продукт успешно удален.");
        } catch (err) {
            console.error("Ошибка при удалении продукта:", err);
            alert("Произошла ошибка при удалении продукта.");
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
            <div className="header-backet">
                <HeaderUni />
            </div>
            <div className="crumbs">
                <div className="MP_breadcrumbs">
                    <BreadCrumbs crumbs={[{ label: "Заявка" }]} />
                </div>
            </div>
            <div className="container-basket">
                <div className="basket-cards">
                    {basketData?.CardsMoves.map((card) => (
                        <div key={card.id} className="basket-card">
                            <img src={card.image_url} alt={card.title_ru} className="basket-image" />
                            <div className="basket-info">
                                <h3>{card.description}</h3>
                                <p>{card.title_en}</p>
                            </div>
                            <button 
                                onClick={() => handleDeleteCard(card.id)} 
                                className="delete-product-btn"
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};