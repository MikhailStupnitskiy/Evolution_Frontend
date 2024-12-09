import { getCardsByName, getAllCards } from "../modules/ApiCards"; // Добавьте getAllProducts
import { Cards } from "../modules/MyInterface";
import "./MainPage.css";
import { SetStateAction, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_LABELS, ROUTES } from "../modules/Routes";
import { OneCard } from "../components/OneCard";
import { BreadCrumbs } from "../components/BreadCrumbs";

export const MainPage = () => {
    
    const [cards, SetCards] = useState<Cards[]>([]);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    
    useEffect(() => {
        getAllCards().then((result: { Cards: SetStateAction<Cards[]>; }) => {
            SetCards(result.Cards);
        });
    }, []);

    const onSubmitFinderHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Предотвращаем перезагрузку страницы
        if (name) {
            getCardsByName(name).then((result) => {
                SetCards(result.Cards);
            });
        } else {
            // Если имя пустое, загружаем все товары
            getAllCards().then((result: { Cards: SetStateAction<Cards[]>; }) => {
                SetCards(result.Cards);
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
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
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