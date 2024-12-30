import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../modules/Routes";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { api } from "../api"; // Путь к сгенерированному Api
import { HeaderUni } from "./HeaderUni";
import "./AllRequestPage.css"; // Подключение стилей
import { DsMoves } from "../api/Api";
import { useNavigate } from "react-router-dom";

export const AllRequestPage = () => {
    const [requests, setRequests] = useState<DsMoves[]>([]); // Стейт для хранения списка заявок
    const [loading, setLoading] = useState<boolean>(true); // Стейт для загрузки
    const [error, setError] = useState<string | null>(null); // Стейт для ошибки

    const navigate = useNavigate();

    // Получаем токен из localStorage
    const token = localStorage.getItem('token');

    const getStatusText = (status: number) => {
        switch (status) {
            case 0:
                return "Черновик";
            case 1:
                return "Отправлен";
            case 2:
                return "Принят";
            case 4:
                return "Отклонен";
            default:
                return "Неизвестный статус";
        }
    };


    // Вызов API для получения заявок
    const fetchRequests = async () => {
        try {
            if (token) {
                // Отправляем запрос с Bearer токеном и статусом 7 в query параметре
                const response = await api.api.moveList(
                    { status: 0 }, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Используем Bearer Auth
                        }
                    }
                );
                console.log(response)
                const Moves = response.data["Moves"] || []; // Используем пустой массив по умолчанию
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
            <div className="header-m">
                <HeaderUni />
                <div className="MP_breadcrumbs">
                    <BreadCrumbs 
                        crumbs={[{ label: "Заявки"}]} 
                    />
                </div>
            </div> 

            <div className="requests-container">
                <h2>Список ходов</h2>
                {requests.length > 0 ? (
                    requests.map((request, index) => (
                        <div className="request-card" key={request.id}>
                            <div className="request-info">
                                <div className="request-index">{index + 1}</div>
                                <h2 className="request-status">{getStatusText(request.status)}</h2>
                                <div className="request-details">
                                    <p>Дата создания: {formatDate(request.date_create!)}</p>
                                    <p>Дата обновления: {formatDate(request.date_update!)}</p>
                                    <p>Дата завершения: {request.date_finish === "0001-01-01T03:00:00+03:00" ? "Не завершена" : formatDate(request.date_finish!)}</p>
                                </div>
                                <div className="request-details">
                                <p>Стадия: {request.stage}</p>
                                <p>Кубик: {request.cube}</p>
                                <p>Игрок: {localStorage.getItem("login")}</p>
                                </div>
                            </div>
                            <button className="info-button"  onClick={() => navigate(`${ROUTES.BASKET}/${request.id}`)}>Подробнее</button>
                        </div>
                    ))
                ) : (
                    <p>Заявки не найдены.</p>
                )}
            </div>

            <div className="actions">
                <Link to={ROUTES.HOME} className="back-home-btn">
                    Вернуться на главную
                </Link>
            </div>
        </div>
    );
};