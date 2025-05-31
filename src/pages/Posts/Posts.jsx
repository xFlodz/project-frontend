import { useState, useEffect } from "react";
import { getAllPosts } from "../../services/apiPost"; 
import PostCard from "../../components/PostCard/PostCard";
import Filter from "../../components/Filter/Filter";
import Pagination from "../../components/Pagination/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import "./Posts.css";

function Posts() {
  const postsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateFilterType: 'creation',
    tagsFilter: [],
    startDate: '',
    endDate: ''
  });

  const handleSearchResults = (results) => {
    setFilteredPosts(results);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts(filters);
        setAllPosts(data);
        setFilteredPosts(data);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при получении постов:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filters]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="posts-page">
      <div className="filters-container">
        <Filter
          filters={filters}
          setFilters={setFilters}
          onSearchResults={handleSearchResults} 
        />
      </div>

      <div className="posts-container">
        <div className="pagination-container">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={setCurrentPage}
          />
        </div>

        <div className="posts-grid">
          {currentPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Posts;
