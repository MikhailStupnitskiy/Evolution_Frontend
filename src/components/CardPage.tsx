
import { FC, useEffect, useState } from 'react';
import { ROUTE_LABELS, ROUTES } from '../modules/Routes';
import { getCardByID } from '../modules/ApiCards';
import { Cards } from '../modules/MyInterface';
import { Link, useParams } from 'react-router-dom';
import { BreadCrumbs } from "../components/BreadCrumbs"

import "./CardPage.css";

export const CardPage: FC = () => {
    const [cardInfo, setCardInfo] = useState<Cards>();
    const { id } = useParams();
    let image: string = '';

    useEffect(() => {
        if (id) {
            getCardByID(id)
                .then((result) => {
                    console.log("result");
                    console.log(result);
                    setCardInfo(result);
                });
        }

        if (id) {
            console.log(id);
        }

    }, [id]);

    if (cardInfo?.image_url === undefined) {
        image = 'http://localhost:9000/test/Home_logo.jpg';
    } else {
        image = cardInfo.image_url; // Исправлено с использованием шаблонной строки
    }
    console.log("cardInfo");
    console.log(cardInfo);

    return (
        <div className="space1">
            <div className="header1">
                <Link to={ROUTES.START}>
                    <button name="home-button"></button>
                </Link>
                <div className="MP_breadcrumbs1">
                    <BreadCrumbs 
                       crumbs={[
                        { label: ROUTE_LABELS.HOME, path: ROUTES.HOME },
                        { label: cardInfo?.title_ru || "Карта" },
                    ]} 
                    />
                </div>
            </div> 
            <div className="container1">
                <div className="card1">
                    <div className="card-image-container1">
                        <img src={image} className="card-image1"></img>
                    </div>
                    <div className="card-text1">
                        <p className="title-in-card1">{cardInfo?.title_ru} {cardInfo?.multiplier}. {cardInfo?.description}</p>

                    </div>
                </div>
            </div>
        </div>
    );
}
