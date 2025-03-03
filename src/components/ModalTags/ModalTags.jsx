import React, { useEffect, useState } from "react";
import { getAllTags } from "../../services/apiTag";
import "./ModalTags.css"; // Подключим стили для модального окна

function ModalTags({ isOpen, onClose, onSelectTags, selectedTags }) {
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSelectedTags, setLocalSelectedTags] = useState(selectedTags); // Локальное состояние для выбранных тегов
  const [suggestedTags, setSuggestedTags] = useState([]); // Состояние для предложенных тегов

  useEffect(() => {
    if (!isOpen) return;

    const fetchTags = async () => {
      try {
        const tags = await getAllTags();
        setAvailableTags(tags);
      } catch (err) {
        setError('Не удалось загрузить теги');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [isOpen]);

  useEffect(() => {
    setLocalSelectedTags(selectedTags);
  }, [selectedTags]);

  // Функция для симуляции предложения тегов (нейросеть будет здесь)
  useEffect(() => {
    const fetchSuggestedTags = async () => {
      const tags = ["React", "JavaScript", "Web Development"];
      setSuggestedTags(tags);
    };

    fetchSuggestedTags();
  }, []);

  const handleCheckboxChange = (tag) => {
    setLocalSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.some((t) => t.id === tag.id)) {
        return prevSelectedTags.filter((t) => t.id !== tag.id);
      } else {
        return [...prevSelectedTags, tag];
      }
    });
  };

  const handleConfirmSelection = () => {
    onSelectTags(localSelectedTags);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose(); // Закрыть при клике на оверлей
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-tags-overlay" onClick={handleOverlayClick}>
      <div className="modal-tags-content">
        <button className="modal-tags-close-button" onClick={onClose}>×</button>
        <h2>Выберите теги</h2>

        {loading && <p>Загружаем теги...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="modal-tags-list">
          {availableTags.map((tag) => (
            <label key={tag.id} className="modal-tag-label">
              <span className="modal-tag-text">{tag.name}</span>
              <input
                type="checkbox"
                checked={localSelectedTags.some((t) => t.id === tag.id)}
                onChange={() => handleCheckboxChange(tag)}
              />
            </label>
          ))}
        </div>

        <div className="modal-suggested-tags">
          <h3>Предложенные теги</h3>
            {suggestedTags.map((tag, index) => (
              <button key={index} className="suggested-tag">{tag}</button>
            ))}
        </div>

        <button className="modal-confirm-button" onClick={handleConfirmSelection}>
          Подтвердить выбор
        </button>
      </div>
    </div>
  );
}

export default ModalTags;
