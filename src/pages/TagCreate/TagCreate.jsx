import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTags, createTag, deleteTag } from "../../services/apiTag";
import Notification from "../../components/Notification/Notification"; // Импортируем компонент Notification
import "./TagCreate.css";

const TagCreate = () => {
    const [tagName, setTagName] = useState("");
    const [tags, setTags] = useState([]);
    const [notification, setNotification] = useState({ message: "", type: "" }); // Состояние для уведомлений
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/");
        } else {
            fetchTags();
        }
    }, [navigate]);

    const fetchTags = async () => {
        try {
            const tagsList = await getAllTags();
            setTags(tagsList);
        } catch (error) {
            console.error("Не удалось загрузить теги:", error);
        }
    };

    const handleAddTag = async () => {
        if (tagName.trim()) {
            try {
                const newTag = await createTag({ name: tagName.trim() });
                setTags(prevTags => [...prevTags, newTag]);
                setTagName("");
                setNotification({ message: "Тег успешно создан.", type: "success" }); // Уведомление об успехе
            } catch (error) {
                console.error("Не удалось добавить тег:", error);
                setNotification({ message: "Не удалось добавить тег.", type: "error" }); // Уведомление об ошибке
            }
        } else {
            setNotification({ message: "Введите имя тега.", type: "error" }); // Уведомление об ошибке
        }
    };

    const handleDeleteTag = async (id) => {
        try {
            await deleteTag(id);
            setTags(prevTags => prevTags.filter(tag => tag.id !== id));
            setNotification({ message: "Тег успешно удален.", type: "success" }); // Уведомление об успехе
        } catch (error) {
            console.error("Не удалось удалить тег:", error);
            setNotification({ message: "Не удалось удалить тег.", type: "error" }); // Уведомление об ошибке
        }
    };

    return (
        <div className="tag-page">
            <h2>Добавление тега</h2>
            <div className="input-group">
                <input 
                    type="text" 
                    value={tagName} 
                    onChange={(e) => setTagName(e.target.value)} 
                    placeholder="Введите имя тега" 
                />
                <button onClick={handleAddTag}>Добавить</button>
            </div>
            
            <div className="tag-list">
                <h3>Список тегов:</h3>
                <ul>
                    {tags.map((tag) => (
                        <li key={tag.id}>
                            <span className="tag-name">{tag.name}</span>
                            <button onClick={() => handleDeleteTag(tag.id)} className="delete-tag-btn">
                                ×
                            </button>
                        </li> 
                    ))}
                </ul>
            </div>

            {/* Компонент Notification */}
            <Notification 
                message={notification.message} 
                type={notification.type} 
                onClose={() => setNotification({ message: "", type: "" })} 
            />
        </div>
    );
};

export default TagCreate;