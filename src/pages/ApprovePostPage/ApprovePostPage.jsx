import { useState, useEffect } from "react";
import { getAllNotApprovedPosts } from "../../services/apiPost";
import PostCard from "../../components/PostCard/PostCard";
import Filter from "../../components/Filter/Filter";
import Pagination from "../../components/Pagination/Pagination";
import { useNavigate } from "react-router-dom";  // Используем useNavigate
import "./ApprovePostPage.css";

function ApprovePostPage() {
  const postsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [postsData, setPostsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateFilterType: "creation",
    tagsFilter: [],
    startDate: "",
    endDate: "",
  });

  const navigate = useNavigate();  // Используем navigate
  const role = localStorage.getItem("role");

  // Переадресация, если пользователь не админ или не создатель постов
  useEffect(() => {
    if (role !== "admin" && role !== "poster") {
      navigate("/"); // Перенаправляем на главную страницу
    }
  }, [role, navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllNotApprovedPosts(filters);
        setPostsData(data);
      } catch (error) {
        console.error("Ошибка при получении постов:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [filters]);

  const totalPages = Math.ceil(postsData.length / postsPerPage);
  const currentPosts = postsData.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="approve-posts-page">
      <div className="approve-filters-container">
        <Filter filters={filters} setFilters={setFilters} />
      </div>

      <div className="approve-posts-container">
        <div className="approve-pagination-container">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={setCurrentPage}
          />
        </div>

        <div className="approve-posts-grid">
          {currentPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ApprovePostPage;
