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

    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 20; // Количество карт на страницу


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

    const fetchCards = async (page: number) => {
        try {
            const offset = (page - 1) * cardsPerPage;
            const response = await getAllCards(cardsPerPage, offset); // Передача limit и offset
            setCards(response.Cards);
            setCurrentPage(page);
        } catch (error) {
            console.error("Ошибка при загрузке карт:", error);
        }
    };

    

    useEffect(() => {
        const isPageReloaded = sessionStorage.getItem("pageReloaded");

        if (isPageReloaded) {
            // Reset authentication on page reload
            localStorage.removeItem("token");
            localStorage.removeItem("login");
            setIsAuthenticated(false);
            setLogin("");
            sessionStorage.removeItem("pageReloaded");
        } else {
            // Check for token on initial page load
            const token = localStorage.getItem("token");
            const savedLogin = localStorage.getItem("login");

            if (token && savedLogin) {
                setIsAuthenticated(true);
                setLogin(savedLogin);
            }
        }
    }, []);
    
    useEffect(() => {
        const handleBeforeUnload = () => {
            sessionStorage.setItem("pageReloaded", "true");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (filteredCards && filteredCards.length > 0) {
            setCards(filteredCards); // Используем сохраненные данные
        } else {
            fetchCards(currentPage); // Загружаем, если нет сохраненных данных
        }
    }, [filteredCards, currentPage]);
    

    const checkAndUpdateMoveID = async () => {
        try {
            const result = await getAllCards(cardsPerPage, (currentPage - 1)*cardsPerPage); // Или другой API для обновления milkRequestID
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

        if (cardName != "") {
            getCardsByName(cardName).then((result) => {
                const cards = result.Cards || [];
                setCards(cards);
                dispatch(setFilteredCards(cards));
            }).catch(() => {
                setCards([]);
                dispatch(setFilteredCards([]));
            });
        } else {
            setCards([]);
            dispatch(setFilteredCards([]));
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

            <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => fetchCards(currentPage - 1)}
                >
                    Предыдущая
                </button>
                <span className="current-page">Страница {currentPage}</span>
                <button
                    disabled={cards.length < cardsPerPage} // Если на текущей странице меньше карт, чем limit
                    onClick={() => fetchCards(currentPage + 1)}
                >
                    Следующая
                </button>
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