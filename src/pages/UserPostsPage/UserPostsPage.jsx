import { useState, useEffect } from "react";
import { getAllUserPosts } from "../../services/apiPost";
import PostCard from "../../components/PostCard/PostCard";
import Filter from "../../components/Filter/Filter";
import Pagination from "../../components/Pagination/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import "./UserPostsPage.css";

function UserPostsPage() {
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

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const data = await getAllUserPosts(filters);
        setPostsData(data);
      } catch (error) {
        console.error("Ошибка при получении постов пользователя:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, [filters]);

  const totalPages = Math.ceil(postsData.length / postsPerPage);
  const currentPosts = postsData.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="user-posts-page">
      <div className="user-filters-container">
        <Filter filters={filters} setFilters={setFilters} />
      </div>

      <div className="user-posts-container">
        <div className="user-pagination-container">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={setCurrentPage}
          />
        </div>

        <div className="user-posts-grid">
          {currentPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserPostsPage;