import { FC } from "react"
import { Cards } from "../modules/MyInterface"
import "./MainPage.css"

interface OneCard {
    card : Cards,
    imageClickHandler: () => void;
}

export const OneCard : FC<OneCard> = ( {card, imageClickHandler} : OneCard) => {

    let image : string = ''

    if (card.image_url === undefined || card.image_url == "") {
        image = "http://localhost:9000/test/Home_logo.jpg"
    } else {
        image = card.image_url
    }


    return (

        <div className="card">
            <div className="info">
                <p className="multiplier">{card.multiplier}</p>
                <p className="title-en">{card.title_en}</p>
            </div>
            <p className="title-ru">{card.title_ru}</p>
            <img src={image} className="image"></img>
            <p className="short-description">{card.description}</p>
            <div className="buttons-in-card">
                <button onClick={() => imageClickHandler()} className="card-button">Подробнее</button> 
            </div>
        </div>

    )


}