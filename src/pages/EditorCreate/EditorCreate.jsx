import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEditors, createEditor, deleteEditor } from "../../services/apiUser";
import "./EditorCreate.css";

const EditorCreate = () => {
    const [editorEmail, setEditorEmail] = useState(""); // Состояние для хранения введенного email
    const [editors, setEditors] = useState([]); // Состояние для списка редакторов
    const navigate = useNavigate();

    // Проверяем роль пользователя при загрузке страницы
    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") { // Если роль не "admin", перенаправляем на главную страницу
            navigate("/"); 
        } else {
            // Если роль "admin", загружаем список редакторов
            fetchEditors();
        }
    }, [navigate]);

    // Функция для загрузки списка редакторов с сервера
    const fetchEditors = async () => {
        try {
            const editorsList = await getAllEditors(); // Получаем список редакторов через API
            setEditors(editorsList); // Обновляем состояние редакторов
        } catch (error) {
            console.error("Не удалось загрузить редакторов:", error); // Ошибка при загрузке данных
        }
    };

    // Функция для добавления нового редактора
    const handleAddEditor = async () => {
        if (editorEmail.trim() && validateEmail(editorEmail)) { // Проверяем, что email введен правильно
            try {
                await createEditor(editorEmail.trim()); // Добавляем нового редактора через API

                // После успешного добавления обновляем список редакторов
                fetchEditors();

                // Очищаем поле ввода
                setEditorEmail("");
            } catch (error) {
                console.error("Не удалось добавить редактора:", error); // Ошибка при добавлении редактора
                alert("Не удалось добавить редактора.");
            }
        } else {
            alert("Введите корректный email."); // Сообщение об ошибке, если email некорректный
        }
    };

    // Функция для удаления редактора
    const handleDeleteEditor = async (id) => {
        try {
            await deleteEditor(id); // Удаляем редактора через API
            fetchEditors(); // Обновляем список редакторов после удаления
        } catch (error) {
            console.error("Не удалось удалить редактора:", error); // Ошибка при удалении редактора
        }
    };

    // Функция для проверки корректности email
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Простая регулярка для проверки email
    };

    return (
        <div className="editor-page">
            <h2>Добавление редактора</h2>
            <div className="input-group">
                <input 
                    type="email" 
                    value={editorEmail} 
                    onChange={(e) => setEditorEmail(e.target.value)} 
                    placeholder="Введите email редактора" 
                />
                <button onClick={handleAddEditor}>Добавить</button>
            </div>
            
            <div className="editor-list">
                <h3>Список редакторов:</h3>
                <ul>
                    {/* Отображаем редакторов с кликабельными ссылками и кнопками удаления */}
                    {editors.map((editor) => (
                        <li key={editor.id}>
                            <a href={`/user/${editor.id}`} className="editor-link">
                                {editor.name} {editor.surname} - {editor.email}
                            </a>
                            <button onClick={() => handleDeleteEditor(editor.id)} className="delete-editor-btn">
                                × {/* Символ "×" для удаления */}
                            </button>
                        </li> 
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default EditorCreate;
