import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEditors, createEditor, deleteEditor } from "../../services/apiUser";
import Notification from "../../components/Notification/Notification"; // Импортируем компонент Notification
import "./EditorCreate.css";

const EditorCreate = () => {
    const [editorEmail, setEditorEmail] = useState("");
    const [editors, setEditors] = useState([]);
    const [notification, setNotification] = useState({ message: "", type: "" }); // Состояние для уведомлений
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/");
        } else {
            fetchEditors();
        }
    }, [navigate]);

    const fetchEditors = async () => {
        try {
            const editorsList = await getAllEditors();
            setEditors(editorsList);
        } catch (error) {
            console.error("Не удалось загрузить редакторов:", error);
        }
    };

    const handleAddEditor = async () => {
        if (editorEmail.trim() && validateEmail(editorEmail)) {
            try {
                await createEditor(editorEmail.trim());
                fetchEditors();
                setEditorEmail("");
                setNotification({ message: "Редактор успешно добавлен.", type: "success" }); // Уведомление об успехе
            } catch (error) {
                console.error("Не удалось добавить редактора:", error);
                setNotification({ message: "Не удалось добавить редактора.", type: "error" }); // Уведомление об ошибке
            }
        } else {
            setNotification({ message: "Введите корректный email.", type: "error" }); // Уведомление об ошибке
        }
    };

    const handleDeleteEditor = async (id) => {
        try {
            await deleteEditor(id);
            fetchEditors();
            setNotification({ message: "Редактор успешно удален.", type: "success" }); // Уведомление об успехе
        } catch (error) {
            console.error("Не удалось удалить редактора:", error);
            setNotification({ message: "Не удалось удалить редактора.", type: "error" }); // Уведомление об ошибке
        }
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
                    {editors.map((editor) => (
                        <li key={editor.id}>
                            <a href={`/user/${editor.id}`} className="editor-link">
                                {editor.name} {editor.surname} - {editor.email}
                            </a>
                            <button onClick={() => handleDeleteEditor(editor.email)} className="delete-editor-btn">
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

export default EditorCreate;