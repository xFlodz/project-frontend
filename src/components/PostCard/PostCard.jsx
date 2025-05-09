import { useState } from "react";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
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

        {/* Если пост не подтвержден, показываем предупреждение */}
        {!post.is_approved && (
          <p className="post-card-warning">Пост не подтвержден</p>
        )}

        <p className="post-card-date">
          Дата создания: {createdAt.toLocaleDateString()}
        </p>

        <p className="post-card-author">
          Автор: <span className="author-name">{post.author}</span>
        </p>

        <div className="post-card-image-wrapper">
          <img
            src={`http://localhost:5000/api/file/${post.main_image}`}
            alt={post.header}
            className={`post-card-image ${isHovered ? "post-card-image-visible" : ""}`}
          />
        </div>

        <p className={`post-card-text ${isHovered ? "post-card-text-visible" : ""}`}>
          {parse(postText.length > 100 ? postText.substring(0, 100) + "..." : postText)}
        </p>

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
