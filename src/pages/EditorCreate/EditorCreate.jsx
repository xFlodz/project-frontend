import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEditors, createEditor, deleteEditor } from "../../services/apiUser";
import Notification from "../../components/Notification/Notification";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import "./EditorCreate.css";

const EditorCreate = () => {
    const [editorEmail, setEditorEmail] = useState("");
    const [editors, setEditors] = useState([]);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [loading, setLoading] = useState(true);
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
        setLoading(true);
        try {
            const editorsList = await getAllEditors();
            setEditors(editorsList);
        } catch (error) {
            console.error("Не удалось загрузить редакторов:", error);
            setNotification({ message: "Ошибка при загрузке редакторов.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleAddEditor = async () => {
        if (editorEmail.trim() && validateEmail(editorEmail)) {
            try {
                await createEditor(editorEmail.trim());
                fetchEditors();
                setEditorEmail("");
                setNotification({ message: "Редактор успешно добавлен.", type: "success" });
            } catch (error) {
                console.error("Не удалось добавить редактора:", error);
                setNotification({ message: "Не удалось добавить редактора.", type: "error" });
            }
        } else {
            setNotification({ message: "Введите корректный email.", type: "error" });
        }
    };

    const handleDeleteEditor = async (id) => {
        try {
            await deleteEditor(id);
            fetchEditors();
            setNotification({ message: "Редактор успешно удален.", type: "success" });
        } catch (error) {
            console.error("Не удалось удалить редактора:", error);
            setNotification({ message: "Не удалось удалить редактора.", type: "error" });
        }
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

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
            <Notification 
                message={notification.message} 
                type={notification.type} 
                onClose={() => setNotification({ message: "", type: "" })} 
            />
        </div>
    );
};

export default EditorCreate;