import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Notification from "./components/Notification/Notification";
import Posts from "./pages/Posts/Posts";
import CreatePost from "./pages/PostsCreate/PostsCreate";
import PostPage from "./pages/PostPage/PostPage";
import EditorCreate from "./pages/EditorCreate/EditorCreate";
import TagCreate from "./pages/TagCreate/TagCreate";
import PostEdit from "./pages/PostEdit/PostEdit";
import UserPostsPage from "./pages/UserPostsPage/UserPostsPage";
import ApprovePostPage from "./pages/ApprovePostPage/ApprovePostPage";
import TimelinePage from "./pages/TimelinePage/TimelinePage";
import './App.css';

function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        // Проверяем, если уведомление уже сохранено в sessionStorage
        const savedNotification = sessionStorage.getItem('notification');
        if (savedNotification) {
            // Если уведомление сохранено в sessionStorage, показываем его
            setNotification(JSON.parse(savedNotification));
            sessionStorage.removeItem('notification'); // Убираем уведомление из sessionStorage после отображения
        } else if (location.state?.notification) {
            // Если уведомление есть в location.state, показываем его
            setNotification(location.state.notification);
            sessionStorage.setItem('notification', JSON.stringify(location.state.notification)); // Сохраняем уведомление в sessionStorage

            // Очищаем уведомление из location.state
            navigate(location.pathname, { replace: true }); // Используем replace, чтобы не добавлять новый маршрут в историю

            setTimeout(() => {
                setNotification(null); // Скрыть уведомление после 7 секунд
            }, 7000);
        }
    }, [location.state, navigate]); // Перезапускаем эффект при изменении location.state

    return (
        <div className="app-container">
            <Header />
            {notification && <Notification message={notification.message} type={notification.type} />}
            <Routes>
                <Route path="/" element={<Posts />} />
                <Route path="/create_post" element={<CreatePost />} />
                <Route path="/post/:address" element={<PostPage />} />
                <Route path="/create_new_editor" element={<EditorCreate />} />
                <Route path="/create_new_tag" element={<TagCreate />} />
                <Route path="/post/edit/:address" element={<PostEdit />} />
                <Route path="/my_posts" element={<UserPostsPage />} />
                <Route path="/approve_posts" element={<ApprovePostPage />} />
                <Route path="/timeline" element={<TimelinePage />} />
            </Routes>
        </div>
    );
}

export default App;
