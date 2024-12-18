import "./ProfilePage.css";
import { useState } from "react";
import {  } from "../modules/Routes";
import { api } from "../api"; // Импорт API
import { HeaderUni } from "./HeaderUni";

export const ProfilePage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("token"));
    const [login, setLogin] = useState<string>(localStorage.getItem("login") || "");
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    console.log(isAuthenticated, setIsAuthenticated, login, setLogin)

    // Проверка авторизации
    const token = localStorage.getItem("token");

    if (!token) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                fontSize: "24px",
                fontWeight: "bold"
            }}>
                403, доступ запрещен
            </div>
        );
    }

    



    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            setMessage("Пожалуйста, заполните оба поля.");
            return;
        }

        try {
            const response = await api.api.changeUserInfoUpdate(
                {
                    old_password: oldPassword,
                    new_password: newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data) {
                setMessage("Пароль успешно изменен.");
                setOldPassword("");
                setNewPassword("");
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                setMessage(err.response.data.message);
            } else {
                setMessage("Произошла ошибка при смене пароля.");
            }
        }
    };

    return (
        <>
            <div className="header-backet">
                <HeaderUni />
            </div>
        
            <div className="container-profile">
                <h1 className="change-pass-h1">Смена пароля</h1>
                <div className="change-password-form">
                    <input
                        type="password"
                        placeholder="Старый пароль"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="password-input"
                    />
                    <input
                        type="password"
                        placeholder="Новый пароль"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="password-input"
                    />
                    <button
                        className="change-password-button"
                        onClick={handleChangePassword}
                    >
                        Сменить пароль
                    </button>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
        </>
    );
};