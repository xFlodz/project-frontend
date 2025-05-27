import React from "react";
import "./ConfirmModal.css";

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    const handleOverlayClick = () => {
        onCancel();
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="confirm-modal-overlay" onClick={handleOverlayClick}>
            <div className="confirm-modal" onClick={handleModalClick}>
                <p>{message}</p>
                <div className="confirm-buttons">
                    <button className="confirm-button" onClick={onConfirm}>Да</button>
                    <button className="cancel-button" onClick={onCancel}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
