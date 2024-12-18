import { FC } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../modules/Routes";

export const HeaderUni: FC = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("token"));
    const [login, setLogin] = useState<string>(localStorage.getItem("login") || "");

    // Обработчик для кнопки входа/выхода
    const handleAuthButtonClick = () => {
        if (isAuthenticated) {
            localStorage.removeItem("token");
            localStorage.removeItem("login");
            setIsAuthenticated(false);
            setLogin("");
            navigate(ROUTES.HOME);
        } else {
            navigate(ROUTES.AUTHORIZATION);
        }
    };

    // Обработчик для кнопки профиля
    const handleProfileClick = () => {
        navigate(ROUTES.PROFILE);
    };

    return (
        <>
            <div className="super-header-main">
                <Link to={ROUTES.START}>
                    <button className="home-button"></button>
                </Link>
                <Link to={ROUTES.HOME} className="no-underline">
                    <button className="profile-button">Карты</button>
                </Link>

                {/* Кнопка "Мои заявки" отображается только если пользователь авторизован */}
                {isAuthenticated && (
                    <Link to={ROUTES.REQUESTS} className="no-underline">
                        <button className="profile-button">Мои заявки</button>
                    </Link>
                )}

                {/* Кнопки профиля и выхода */}
                {isAuthenticated ? (
                    <div className="user-actions">
                        <button
                            className="profile-button"
                            onClick={handleProfileClick}
                        >
                            {login}
                        </button>
                        <button
                            className="auth-button"
                            onClick={handleAuthButtonClick}
                        >
                            Выход
                        </button>
                    </div>
                ) : (
                    <button
                        className="auth-button"
                        onClick={handleAuthButtonClick}
                    >
                        Вход
                    </button>
                )}
            </div>
        </>
    );
};