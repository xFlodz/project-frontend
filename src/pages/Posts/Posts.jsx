import { useState, useEffect } from "react";
import { getAllPosts, searchPosts } from "../../services/apiPost"; 
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    dateFilterType: 'creation',
    tagsFilter: [],
    startDate: '',
    endDate: ''
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
  };

  const handleSearchResults = (results) => {
    setFilteredPosts(results);
    setCurrentPage(1);
  };

  const handleApplyFilters = async (filters, searchQuery) => {
    try {
      let data;
      if (searchQuery && searchQuery.trim() !== "") {
        data = await searchPosts({
          query: searchQuery,
          dateFilterType: filters.dateFilterType,
          tagsFilter: filters.tagsFilter,
          startDate: filters.startDate,
          endDate: filters.endDate,
        });
      } else {
        data = await getAllPosts({
          dateFilterType: filters.dateFilterType,
          tagsFilter: filters.tagsFilter,
          startDate: filters.startDate,
          endDate: filters.endDate,
        });
      }

      setFilteredPosts(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Ошибка при получении постов:", error);
    }
  };

    useEffect(() => {
      setLoading(true);
      handleApplyFilters(filters, "").finally(() => setLoading(false));
    }, [filters]);

  const totalPages = Math.ceil(filteredPosts?.length / postsPerPage);
  const currentPosts = Array.isArray(filteredPosts)
  ? filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
  : [];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="posts-page">
      <div className="filters-container">
        <Filter
          filters={filters}
          setFilters={handleFilterChange}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchQueryChange}
          onApplyFilters={handleApplyFilters}
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
          {Array.isArray(currentPosts) && currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Posts;
