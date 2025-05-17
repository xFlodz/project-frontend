import React, { useState, useEffect } from "react";
import "./Notification.css";

const Notification = ({ message, type, onClose }) => {
    const [show, setShow] = useState(false);
    const [hide, setHide] = useState(false);

    // Появление уведомления
    useEffect(() => {
        if (message) {
            setShow(true);  // Показываем уведомление
            setHide(false); // Сбрасываем анимацию скрытия
        }
    }, [message]);

    // Запуск анимации скрытия через 3 секунды
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setHide(true); // Запускаем анимацию исчезновения
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    // После анимации скрытия вызываем onClose, чтобы очистить уведомление
    useEffect(() => {
        if (hide) {
            const animationDuration = 500; // время анимации скрытия в мс (подстрой под свой CSS)
            const timer = setTimeout(() => {
                setShow(false);
                setHide(false);
                if (onClose) onClose(); // вызываем колбек закрытия
            }, animationDuration);

            return () => clearTimeout(timer);
        }
    }, [hide, onClose]);

    if (!message || !show) return null;

    return (
        <div className={`notification ${type} ${show ? "show" : ""} ${hide ? "hide" : ""}`}>
            <span>{message}</span>
        </div>
    );
};

export default Notification;
