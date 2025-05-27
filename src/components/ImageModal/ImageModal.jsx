import React, { useEffect } from "react";
import "./ImageModal.css";

const ImageModal = ({ imageSrc, description, onClose }) => {

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content-photo">
                <div className="modal-image-container">
                    <img src={imageSrc} alt="Modal Image" className="modal-image" />
                    {description && <div className="modal-description">{description}</div>}
                    
                    <div className="close-button" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
