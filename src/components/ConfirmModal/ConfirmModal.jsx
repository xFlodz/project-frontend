import React from "react";
import "./ConfirmModal.css";

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal">
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
