import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../modules/Routes";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { api } from "../api";  // Путь к сгенерированному Api
import { HeaderUni } from "./HeaderUni";
import "./AllRequestPage.css"; // Подключение стилей
import { DsMoves } from "../api/Api";

export const AllRequestPage = () => {
    const [requests, setRequests] = useState<DsMoves[]>([]); // Стейт для хранения списка заявок
    const [loading, setLoading] = useState<boolean>(true); // Стейт для загрузки
    const [error, setError] = useState<string | null>(null); // Стейт для ошибки

    // Получаем токен из localStorage
    const token = localStorage.getItem('token');

    // Вызов API для получения заявок
    const fetchRequests = async () => {
        try {
            if (token) {
                // Отправляем запрос с Bearer токеном и статусом 7 в query параметре
                const response = await api.api.moveList(
                    { status: "7" }, // Передаем статус 7 в query
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Используем Bearer Auth
                        }
                    }
                );
                console.log(response)
                const Moves = response.data["moves"] || []; // Используем пустой массив по умолчанию
                console.log(Moves)
                setRequests(Moves);  
            } else {
                setError("Токен не найден.");
            }
        } catch (err) {
            console.error("Ошибка при загрузке заявок:", err);
            setError("Произошла ошибка при загрузке заявок.");
        } finally {
            setLoading(false); // Завершаем загрузку
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []); // Вызываем fetchRequests один раз при монтировании компонента

    // Функция для форматирования даты
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    };

    if (loading) {
        return <div>Загрузка данных...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="all-requests-page">
            
            <div className="header-backet">
                <HeaderUni />
            </div>


            <div className="breadcrumbs">
                <BreadCrumbs crumbs={[{ label: "Заявки" }]} />
            </div>

            <div className="requests-table-container">
                <h1>Список заявок</h1>
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Статус заявки</th>
                            <th>Дата создания</th>
                            <th>Дата обновления</th>
                            <th>Дата завершения</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length > 0 ? (
                            requests.map((request, index) => (
                                <tr key={request.id}>
                                    <td>{index + 1}</td>
                                    <td>{request.status}</td>
                                    <td>{formatDate(request.date_create!)}</td>
                                    <td>{formatDate(request.date_update!)}</td>
                                    <td>{request.date_finish === "0001-01-01T03:00:00+03:00" ? "Не завершена" : formatDate(request.date_finish!)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5}>Заявки не найдены.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="actions">
                <Link to={ROUTES.HOME} className="back-home-btn">
                    Вернуться на главную
                </Link>
            </div>
        </div>
    );
};