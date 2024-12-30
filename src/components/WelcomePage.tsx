
import "./WelcomePage.css";
import { ROUTES } from "../modules/Routes";
import { Link } from "react-router-dom";

// Функция для замены \n на <br />
const replaceNewlines = (text: string) => {
    return text.split('\n').map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ));
};

export const WelcomePage = () => {
    const descriptionText = `«Эволюция» — это настольный симулятор развития жизни на Земле
    Он основан на дарвиновском принципе естественного отбора

Цель игры — сформировать самую развитую и многочисленную популяцию живых существ
Вам нужно набрать больше баллов, чем другие участники.`;

    return (
        <>
            <div className="space">
                <header className="header">
                    <Link to={ROUTES.START}>
                        <button className="home-button"></button>
                    </Link>
                    <Link to={ROUTES.HOME}>
                        <h1 className="Evo">EVOLUTION</h1>
                    </Link>
                </header>
                <div className="container">
                    <p className="description">
                        {replaceNewlines(descriptionText)}
                    </p>
                </div>
            </div>
        </>
    );
}
