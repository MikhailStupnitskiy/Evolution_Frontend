import { getCardsByName, getAllCards } from "../modules/ApiCards"; // Добавьте getAllProducts
import { Cards } from "../modules/MyInterface";
import "./MainPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_LABELS, ROUTES } from "../modules/Routes";
import { OneCard } from "../components/OneCard";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { useDispatch, useSelector } from "react-redux";
import { setCardName, setFilteredCards  } from "../modules/searchSlice"; // Путь к файлу searchSlice
import { RootState } from "../modules/store"; // Путь к файлу store
import { HeaderUni } from "./HeaderUni";

export const MainPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Извлекаем данные из Redux
    const { cardName, filteredCards } = useSelector((state: RootState) => state.search);
    
    // Состояние для отображения продуктов
    const [cards, setCards] = useState<Cards[]>(filteredCards || []); // Изначально используем filteredProducts
    const [moveID, setMoveID] = useState<number>(0);
    const [CardsInMoveCount, setCardsInMoveCount] = useState<number>(0);

    const updateCardsInMoveCount = (newCount: number) => {
        setCardsInMoveCount(newCount); // Обновляем состояние
    };
    

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("token"));
    const [login, setLogin] = useState<string>(localStorage.getItem("login") || "");
    
    useEffect(() => {
        const fetchCards = async () => {
            try {
                // Если есть фильтрованные продукты, показываем их
                if (filteredCards.length >= 0 && cardName !== "") {
                    setCards(filteredCards);
                } else {
                    // Если фильтрованных продуктов нет, загружаем все продукты
                    const result = await getAllCards();
                    setCards(result.Cards);
                    setMoveID(result.MoveID);
                    setCardsInMoveCount(result.CardsInMoveCount)
                    console.log("result.MilkRequestID:", result.MoveID);
                    console.log("milkRequestID после установки:", result.MoveID);
                    console.log(result.CardsInMoveCount, setLogin(login), setIsAuthenticated(isAuthenticated))
                }
            } catch (error) {
                console.error("Ошибка при загрузке продуктов:", error);
            }
        };

        fetchCards(); 
    }, [filteredCards]); 

    const checkAndUpdateMoveID = async () => {
        try {
            const result = await getAllCards(); // Или другой API для обновления milkRequestID
            setMoveID(result.MoveID);
            setCardsInMoveCount(result.CardsInMoveCount)
            
            console.log("AAAAA");
        } catch (error) {
            console.error("Ошибка при обновлении moveID:", error);
        }
    };
    

    const onSubmitFinderHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(setCardName(cardName));

        if (cardName) {
            getCardsByName(cardName).then((result) => {
                const cards = result.Cards || [];
                setCards(cards);
                dispatch(setFilteredCards(cards));
            }).catch(() => {
                setCards([]);
                dispatch(setFilteredCards([]));
            });
        } else {
            getAllCards().then((result) => {
                const allCards = result.Cards || [];
                setCards(allCards);
                setMoveID(result.MoveID); // Сохраняем MoveID
                dispatch(setFilteredCards(allCards));
            }).catch(() => {
                setCards([]);
                setMoveID(0); // Устанавливаем в 0 в случае ошибки
                dispatch(setFilteredCards([]));
            });
        }
    };

    const imageClickHandler = (id: number) => {
        navigate(`${ROUTES.HOME}/${id}`);
    };

    

    const handleCartButtonClick = () => {
        if (moveID !== 0) {
            navigate(`${ROUTES.BASKET}/${moveID}`);
        }
    };

    return (
        <>
            <div className="header-m">
                <HeaderUni />
                <div className="MP_breadcrumbs">
                    <BreadCrumbs 
                        crumbs={[{ label: ROUTE_LABELS.HOME}]} 
                    />
                </div>
            </div> 
            <div className="navigation_line">
                <form onSubmit={onSubmitFinderHandler}> {/* Форма для поиска */}
                    <input className="search_field"
                        type="text" 
                        placeholder="Поиск..." 
                        value={cardName}
                        onChange={(e) => dispatch(setCardName(e.target.value))}
                    /> 
                    <button type="submit">Поиск
                    </button> {/* Кнопка поиска */}
                    <button 
                        className="button-def"
                        type="button"
                        disabled={moveID === 0} // Деактивация кнопки
                        onClick={handleCartButtonClick} // Обработчик клика
                    >
                        Ход
                        <span className="card-count">{CardsInMoveCount}</span>
                    </button>
                </form>
            </div>
            <div className="container-main">
                {Array.isArray(cards) && cards.map(card => (
                    <OneCard 
                        card={card} 
                        key={card.id} 
                        imageClickHandler={() => imageClickHandler(card.id)}
                        checkAndUpdateMoveID={checkAndUpdateMoveID}
                        updateCardsInMoveCount={updateCardsInMoveCount}
                    />
                ))}  
            </div>
        </>
    );
};