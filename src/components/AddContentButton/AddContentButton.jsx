import React, { useState, useEffect, useRef } from "react";
import { FaImage, FaVideo, FaFileAlt } from "react-icons/fa";
import "./AddContentButton.css";

function AddContentButton({ onAddText, onAddImage, onAddVideo }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddText = () => {
    onAddText();
    setIsOpen(false);
  };

  const handleAddImage = () => {
    onAddImage();
    setIsOpen(false);
  };

  const handleAddVideo = () => {
    onAddVideo();
    setIsOpen(false);
  };

  return (
    <div className="add-content-button" ref={dropdownRef}>
      <button type="button" onClick={toggleDropdown} className="add-button">
        Добавить контент
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <button type="button" onClick={handleAddText} className="icon-button">
            <FaFileAlt /> Текст
          </button>
          <button type="button" onClick={handleAddImage} className="icon-button">
            <FaImage /> Изображение
          </button>
          <button type="button" onClick={handleAddVideo} className="icon-button">
            <FaVideo /> Видео
          </button>
        </div>
      )}
    </div>
  );
}

export default AddContentButton;