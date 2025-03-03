import React, { useState, useEffect } from "react";
import "./Notification.css";

const Notification = ({ message, type, onClose }) => {
    const [show, setShow] = useState(false);
    const [hide, setHide] = useState(false);

    // Появление уведомления
    useEffect(() => {
        if (message) {
            setShow(true); // Показываем уведомление
            setHide(false); // Сбрасываем анимацию скрытия
        }
    }, [message]);

    // Скрытие уведомления через 3 секунды с плавной анимацией
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setHide(true); // Запускаем анимацию исчезновения
            }, 3000); // Убираем уведомление через 3 секунды
            return () => clearTimeout(timer); // Очистить таймер, если уведомление исчезло раньше
        }
    }, [message]);

    const handleClose = () => {
        setHide(true); // Принудительно скрываем уведомление при нажатии на кнопку
        setTimeout(() => {
            onClose(); // Вызываем onClose после завершения анимации
        }, 300); // Задержка для анимации исчезновения
    };

    if (!message) return null;

    return (
        <div
            className={`notification ${type} ${show ? "show" : ""} ${hide ? "hide" : ""}`}
        >
            <span>{message}</span>
            <button className="close-btn" onClick={handleClose}>✖</button>
        </div>
    );
};

export default Notification;
