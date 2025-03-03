import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTags, createTag, deleteTag } from "../../services/apiTag";
import "./TagCreate.css"; // Новый CSS для страницы тегов

const TagCreate = () => {
    const [tagName, setTagName] = useState(""); // Состояние для хранения введенного имени тега
    const [tags, setTags] = useState([]); // Состояние для списка тегов
    const navigate = useNavigate();

    // Проверяем роль пользователя при загрузке страницы
    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") { // Если роль не "admin", перенаправляем на главную страницу
            navigate("/"); 
        } else {
            // Если роль "admin", загружаем список тегов
            fetchTags();
        }
    }, [navigate]);

    // Функция для загрузки списка тегов с сервера
    const fetchTags = async () => {
        try {
            const tagsList = await getAllTags(); // Получаем список тегов через API
            setTags(tagsList); // Обновляем состояние тегов
        } catch (error) {
            console.error("Не удалось загрузить теги:", error); // Ошибка при загрузке данных
        }
    };

    // Функция для добавления нового тега
    const handleAddTag = async () => {
        if (tagName.trim()) { // Проверяем, что имя тега введено
            try {
                const newTag = await createTag({ name: tagName.trim() }); // Добавляем новый тег через API

                // После успешного добавления обновляем список тегов
                setTags(prevTags => [...prevTags, newTag]);

                // Очищаем поле ввода
                setTagName("");
            } catch (error) {
                console.error("Не удалось добавить тег:", error); // Ошибка при добавлении тега
                alert("Не удалось добавить тег.");
            }
        } else {
            alert("Введите имя тега."); // Сообщение об ошибке, если имя тега пустое
        }
    };

    // Функция для удаления тега
    const handleDeleteTag = async (id) => {
        try {
            await deleteTag(id); // Удаляем тег через API
            setTags(prevTags => prevTags.filter(tag => tag.id !== id)); // Обновляем список тегов после удаления
        } catch (error) {
            console.error("Не удалось удалить тег:", error); // Ошибка при удалении тега
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
                    {/* Отображаем теги с кнопками удаления */}
                    {tags.map((tag) => (
                        <li key={tag.id}>
                            <span className="tag-name">{tag.name}</span>
                            <button onClick={() => handleDeleteTag(tag.id)} className="delete-tag-btn">
                                × {/* Символ "×" для удаления */}
                            </button>
                        </li> 
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TagCreate;
