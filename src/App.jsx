import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Notification from "./components/Notification/Notification";
import Posts from "./pages/Posts/Posts";
import CreatePost from "./pages/PostsCreate/PostsCreate";
import PostPage from "./pages/PostPage/PostPage";
import EditorCreate from "./pages/EditorCreate/EditorCreate";
import TagCreate from "./pages/TagCreate/TagCreate";
import PostEdit from "./pages/PostEdit/PostEdit";
import './App.css';

function App() {
    const location = useLocation();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (location.state?.notification) {
            setNotification(location.state.notification);

            setTimeout(() => {
                setNotification(null);
            }, 7000);
        }
    }, [location.state]);

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
            </Routes>
        </div>
    );
}

export default App;
