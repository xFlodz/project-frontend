import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPostByAddress, deletePost, approvePost, LikePost } from "../../services/apiPost";
import ImageModal from "../../components/ImageModal/ImageModal";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import Notification from "../../components/Notification/Notification";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import parse from "html-react-parser";
import "./PostPage.css";

const BASE_URL = "http://localhost:5000/api/file/";

const PostPage = () => {
    const { address } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalImage, setModalImage] = useState(null);
    const [modalDescription, setModalDescription] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const userRole = localStorage.getItem("role");
    const [liked, setLiked] = useState(false);
    const captchaRef = useRef(null);
    const [captchaVisible, setCaptchaVisible] = useState(false);
    const [captchaPassed, setCaptchaPassed] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const fingerprint = localStorage.getItem('fingerprint')
                const data = await getPostByAddress(address, fingerprint);
                setPost(data);
                setLiked(data.is_liked);
            } catch (err) {
                setError("Ошибка загрузки поста.");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [address]);

    useEffect(() => {
    if (captchaVisible && window.turnstile && captchaRef.current) {
        captchaRef.current.innerHTML = "";

        window.turnstile.render(captchaRef.current, {
            sitekey: "1x00000000000000000000AA",
            callback: (token) => {
                handleCaptchaSuccess(token);
            },
            theme: "light",
        });
    }
}, [captchaVisible]);

    const handleImageClick = (src, description) => {
        setModalImage(src);
        setModalDescription(description);
    };

    const handleMainImageClick = () => {
        setModalImage(`${BASE_URL}${post.main_image}`);
        setModalDescription(null);
    };

    const handleModalClose = () => {
        setModalImage(null);
        setModalDescription(null);
    };

    const handleDeleteClick = () => {
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deletePost(post.address);
            navigate("/", { state: { notification: { message: "Пост успешно удален.", type: "success" } } });
        } catch (err) {
            navigate("/", { state: { notification: { message: "Ошибка при удалении поста", type: "error" } } });
        }
        setIsConfirmOpen(false);
    };

    const handleEditClick = () => {
        navigate(`/post/edit/${address}`);
    };

    const handleCaptchaSuccess = (token) => {
        localStorage.setItem("likeCaptchaPassed", "true");
        setCaptchaVisible(false);
        setCaptchaPassed(true);
        proceedLike();
    };

    const proceedLike = async () => {
        setLiked(prev => {
            const newLiked = !prev;
            setPost(prevPost => ({
                ...prevPost,
                likes: prevPost.likes + (newLiked ? 1 : -1)
            }));
            return newLiked;
        });

        try {
            await LikePost(address, localStorage.getItem('fingerprint'));
        } catch (err) {
            console.error('Ошибка при отправке лайка:', err);
        }
    };

    const handleLikeClick = () => {
        const passed = localStorage.getItem("likeCaptchaPassed") === "true";

        if (!passed && !captchaPassed) {
            setCaptchaVisible(true);
            return;
        }

        proceedLike();
    };

    const handleApproveClick = async () => {
        try {
            await approvePost(post.address);
            setPost(prevPost => ({ ...prevPost, is_approved: true }));
            setNotification({ message: "Пост успешно одобрен.", type: "success" });
        } catch (err) {
            setNotification({ message: "Ошибка при одобрении поста.", type: "error" });
        }
    };

    if (loading) return <LoadingSpinner />;;
    if (error) return <div className="error">{error}</div>;
    if (!post) return <div className="not-found">Пост не найден.</div>;

    return (
        <div className="post-page">
            <div className="post-header">
                <img
                    src={`${BASE_URL}${post.main_image}`}
                    alt={post.header || "Изображение"}
                    className="main-image"
                    onClick={handleMainImageClick}
                />
                <h1 className="post-title">{post.header || "Без заголовка"}</h1>

                {post.lead && (
                    <p className="post-lead">
                        {parse(post.lead)}
                    </p>
            )}
            </div>

            <div className="post-content">
                {post.structure && post.structure.length > 0 && (
                    <div className="post-structure">
                        {post.structure.map((item, index) => {
                            if (item.type === "text") {
                                return (
                                    <div key={index} className="post-text">
                                        {parse(item.text)}
                                    </div>
                                );
                            } else if (item.type === "image") {
                                return (
                                    <div key={index} className="post-image">
                                        <img
                                            src={`${BASE_URL}${item.src}`}
                                            alt={item.description || `Изображение ${index + 1}`}
                                            className="structure-image"
                                            onClick={() => handleImageClick(`${BASE_URL}${item.src}`, item.description)}
                                        />
                                        {item.description && <p className="image-description">{item.description}</p>}
                                    </div>
                                );
                            } else if (item.type === "video") {
                                return (
                                    <div key={index} className="post-video">
                                        <iframe
                                            src={item.src}
                                            title={`Видео ${index + 1}`}
                                            className="video-player"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}

                <div className="post-tags">
                    {post.tags.length > 0 ? (
                        post.tags.map((tag, index) => <span key={index} className="tag">#{tag.tag_name}</span>)
                    ) : (
                        <span className="tag">#БезТегов</span>
                    )}
                </div>
            </div>

            <div className="post-dates">
                <div className="date-left">
                    <p><strong>Дата начала:</strong> {post.date_range?.start_date || "Не указано"}</p>
                    <p><strong>Дата окончания:</strong> {post.date_range?.end_date || "Не указано"}</p>
                </div>
                <div className="date-right">
                    <p><strong>Дата создания:</strong> {new Date(post.created_at).toLocaleString()}</p>
                    <p><strong>Автор:</strong> {post.author || "Аноним"}</p>
                    <p><strong>Рецезент:</strong> {post.reviewer || "Аноним"}</p>
                    <p><strong>Просмотры:</strong> {post.views || "Неизвестно"}</p>
                    <p><strong>Отметок понравилось:</strong> {post.likes || "0"}</p>
                </div>
            </div>

            <div className="like-button-container">
                <button className={`like-button ${liked ? "liked" : ""}`} onClick={handleLikeClick}>
                    ❤️ Понравилось
                </button>
            </div>

            {userRole === "poster" && (
                <div className="post-actions-container">
                    <button className="timeline-post-button" onClick={handleEditClick}>Добавить в таймлайн</button>
                    <button className="edit-post-button" onClick={handleEditClick}>Изменить</button>
                    {post.is_approved === false && (
                        <button className="approve-post-button" onClick={handleApproveClick}>Одобрить</button>
                    )}
                    <button className="delete-post-button" onClick={handleDeleteClick}>Удалить</button>
                </div>
            )}

            <ConfirmModal
                isOpen={isConfirmOpen}
                message="Вы уверены, что хотите удалить этот пост?"
                onConfirm={confirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
            />

            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: "", type: "" })}
            />

            {modalImage && (
                <ImageModal
                    imageSrc={modalImage}
                    description={modalDescription}
                    onClose={handleModalClose}
                />
            )}

            {captchaVisible && (
                <div className="captcha-container">
                    <div
                        ref={captchaRef}
                        className="cf-turnstile"
                    ></div>
                </div>
            )}
        </div>
    );
};

export default PostPage;
