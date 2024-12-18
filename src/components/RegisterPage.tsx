import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../modules/Routes";
import { api } from '../api';  // Путь к сгенерированному Api
import "./RegisterPage.css";

interface RegisterUserResponse {
    message: string;
  }

export const RegisterPage: FC = () => {
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string | null>(null); // Для сообщения от сервера

    const handleAuth = async () => {
        try {
            const response = await api.api.registerUserCreate({
                login,
                password,
            });
            const data = response.data as RegisterUserResponse;

            // Устанавливаем сообщение из ответа сервера
            setMessage(data.message || "Успех");
        } catch (err: any) {
            if (err.response?.status === 500 && err.response?.data?.message) {
                setMessage(err.response.data.message); // Сообщение от сервера при 500
            } else if (err.response?.data?.error) {
                setMessage(err.response.data.error); // Сообщение для других ошибок
            } else {
                setMessage("Произошла ошибка. Попробуйте снова."); // Общая ошибка
            }
        }
    };

    return (
        <>  
            <div className="space-reg">
                <div className="super-header">
                    <Link to={ROUTES.START}>
                        <button className="home-button"></button>
                    </Link>
                    <Link to={ROUTES.HOME} className="no-underline">
                        <h2 className="h2-auth-prods-auth">Карты</h2>
                    </Link>
                </div>
                <div className="container-reg">
                    <div className="container-header-reg">
                        <span>Регистрация / </span>
                        <Link to={ROUTES.AUTHORIZATION} className="no-underline-reg">
                            <span className="h2-reg-to-auth">Авторизация</span>
                        </Link>
                    </div>
                    <div className="container-data-reg">
                        <div className="container-data-reg-login">
                            <input
                                type="text"
                                placeholder="Login"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                            />
                        </div>

                        <div className="container-data-reg-password">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Вывод сообщения от сервера */}
                        {message && <div className="server-message">{message}</div>}

                        <button className="button-auth" onClick={handleAuth}>
                            Зарегистрироваться
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};