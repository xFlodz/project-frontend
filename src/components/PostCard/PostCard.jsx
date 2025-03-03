import { useState } from "react";
import { Link } from "react-router-dom";
import "./PostCard.css";

function PostCard({ post }) {
  const [isHovered, setIsHovered] = useState(false);
  const createdAt = new Date(post.created_at);

  // Извлекаем текст из массива и объединяем в одну строку
  const postText = post.text && post.text.length > 0 ? post.text.map(item => item.text).join(" ") : "Нет текста...";

  return (
    <Link
      to={`/post/${post.address}`}
      className={`post-card-item ${isHovered ? "post-card-item-expanded" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="post-card-content">
        <h3 className="post-card-title">{post.header}</h3>
        <p className="post-card-date">
          Дата создания: {createdAt.toLocaleDateString()}
        </p>

        {/* Имя автора серым текстом */}
        <p className="post-card-author">
          Автор: <span className="author-name">{post.author}</span>
        </p>

        {/* Обёртка для изображения, всегда в DOM */}
        <div className="post-card-image-wrapper">
          <img
            src={`http://localhost:5000/api/file/${post.main_image}`}
            alt={post.header}
            className={`post-card-image ${isHovered ? "post-card-image-visible" : ""}`} // Добавляем класс для анимации
          />
        </div>

        {/* Текст поста */}
        <p className={`post-card-text ${isHovered ? "post-card-text-visible" : ""}`}>
          {postText.length > 100 ? postText.substring(0, 100) + "..." : postText}
        </p>

        {/* Теги, расположенные справа */}
        <div className="post-card-tags">
          {post.tags && post.tags.length > 0 ? (
            post.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag.tag_name}</span>
            ))
          ) : (
            <span className="tag">#БезТегов</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
