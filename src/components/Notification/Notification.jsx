import React, { useState, useEffect } from "react";
import "./Notification.css";

const Notification = ({ message, type, onClose }) => {
    const [show, setShow] = useState(false);
    const [hide, setHide] = useState(false);

    useEffect(() => {
        if (message) {
            setShow(true);
            setHide(false);
        }
    }, [message]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setHide(true);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        if (hide) {
            const animationDuration = 500;
            const timer = setTimeout(() => {
                setShow(false);
                setHide(false);
                if (onClose) onClose();
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
