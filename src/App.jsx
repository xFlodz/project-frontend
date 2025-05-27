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
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import './App.css';

function App() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("notification");
    if (saved) {
      setNotification(JSON.parse(saved));
      sessionStorage.removeItem("notification");
    }
  }, []);
  const handleNotificationClose = () => {
    setNotification(null);
  };

    return (
        <div className="app-container">
            <Header setNotification={setNotification} />
            {notification && <Notification message={notification.message} type={notification.type} onClose={handleNotificationClose}/>}
            <Routes>
                <Route path="/" element={<Posts />} />
                <Route path="/create_post" element={<CreatePost />} />
                <Route path="/post/:address" element={<PostPage />} />
                <Route path="/create_new_editor" element={<EditorCreate />} />
                <Route path="/create_new_tag" element={<TagCreate />} />
                <Route path="/post/edit/:address" element={<PostEdit setNotification={setNotification}/>} />
                <Route path="/my_posts" element={<UserPostsPage />} />
                <Route path="/approve_posts" element={<ApprovePostPage />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/user/:id" element={<ProfilePage />} />
            </Routes>
        </div>
    );
}

export default App;
