import { getCardsByName, getAllCards } from "../modules/ApiCards"; // Добавьте getAllProducts
import { Cards } from "../modules/MyInterface";
import "./MainPage.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_LABELS, ROUTES } from "../modules/Routes";
import { OneCard } from "../components/OneCard";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { useDispatch, useSelector } from "react-redux";
import { setCardName, setFilteredCards  } from "../modules/searchSlice"; // Путь к файлу searchSlice
import { RootState } from "../modules/store"; // Путь к файлу store

export const MainPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Извлекаем данные из Redux
    const { cardName, filteredCards } = useSelector((state: RootState) => state.search);
    
    // Состояние для отображения продуктов
    const [cards, setCards] = useState<Cards[]>(filteredCards || []); // Изначально используем filteredProducts
    
    useEffect(() => {
        // Если фильтрованные продукты уже есть в Redux, их можно сразу отобразить
        if (filteredCards.length > 0) {
            setCards(filteredCards);
        } else {
            // Если нет фильтрованных продуктов, загружаем все
            getAllCards().then((result) => {
                setCards(result.Cards); // Заменяем на правильный тип данных
            });
        }
    }, [filteredCards]); // Перезапускаем useEffect, если filteredProducts изменились

    

    const onSubmitFinderHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Предотвращаем перезагрузку страницы
        dispatch(setCardName(cardName));

        if (cardName) {
            getCardsByName(cardName).then((result) => {
                setCards(result.Cards);
                dispatch(setFilteredCards(result.Cards)); // Сохраняем отфильтрованные продукты в Redux
            });
        } else {
            // Если имя пустое, загружаем все товары
            getAllCards().then((result) => {
                setCards(result.Cards);
                dispatch(setFilteredCards(result.Cards)); // Загружаем все продукты в Redux
            });
        }
    };

    const imageClickHandler = (id: number) => {
        navigate(`${ROUTES.HOME}/${id}`);
    };

    return (
        <>
            <div className="header">
                <Link to={ROUTES.START}>
                    <button name="home-button"></button>
                </Link>
                <div className="MP_breadcrumbs">
                    <BreadCrumbs 
                        crumbs={[{ label: ROUTE_LABELS.HOME}]} 
                    />
                </div>
            </div> 
            <div className="navigation_line">
                <form onSubmit={onSubmitFinderHandler}> {/* Форма для поиска */}
                    <input className="search_field"
                        size ={113} 
                        type="text" 
                        placeholder="Поиск..." 
                        value={cardName}
                        onChange={(e) => dispatch(setCardName(e.target.value))}
                    /> 
                    <button type="submit">Поиск</button> {/* Кнопка поиска */}
                </form>
            </div>
            <div className="container-main">
                {Array.isArray(cards) && cards.map(card => (
                    <OneCard 
                        card={card} 
                        key={card.id} 
                        imageClickHandler={() => imageClickHandler(card.id)}
                    />
                ))}  
            </div>
        </>
    );
};