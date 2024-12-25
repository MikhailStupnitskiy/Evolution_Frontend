import { FC } from "react"
import { Cards } from "../modules/MyInterface"
import "./MainPage.css"
import { useDispatch } from 'react-redux'; // Используем useDispatch для получения функции dispatch
import { addCardToMove } from "../modules/thunks/AddToMove"; // Импорт вашего thunks

interface OneCard {
    card : Cards,
    imageClickHandler: () => void;
    checkAndUpdateMoveID: () => Promise<void>;
    updateCardsInMoveCount: (newCount: number) => void; // Новая функция
}

export const OneCard : FC<OneCard> = ( {card, imageClickHandler, checkAndUpdateMoveID} : OneCard) => {

    const token = localStorage.getItem("token");
    const dispatch = useDispatch(); // Используем useDispatch для получения функции dispatch

    const handleAddCard = async () => {
        if (!token) {
            console.error("Токен отсутствует");
            return;
        }
    
        try {
            // Ждем завершения добавления карты
            //@ts-ignore
            const response = await dispatch(addCardToMove({ cardId: card.id, token }));
    
            if (addCardToMove.fulfilled.match(response)) {
                console.log("Карта успешно добавлена в запрос", response.payload);
                // После успешного добавления обновляем moveID
                await checkAndUpdateMoveID();
            } else {
                console.error("Ошибка при добавлении карты:", response.payload);
            }
        } catch (err) {
            console.error("Произошла ошибка при добавлении карты:", err);
        }
    };
    


    return (

        <div className="card">
            <div className="info">
                <p className="multiplier">{card.multiplier}</p>
                <p className="title-en">{card.title_en}</p>
            </div>
            <p className="title-ru">{card.title_ru}</p>
            <img src={card.image_url || "Home_logo.jpg"} className="image"></img>
            <p className="short-description">{card.description}</p>
            <div className="buttons-in-card">
                <button onClick={() => imageClickHandler()} className="card-button">Подробнее</button>
                {token && (
                        <button onClick={handleAddCard} className="card-button" type="button">+</button>
                    )} 
            </div>
        </div>

    )


}