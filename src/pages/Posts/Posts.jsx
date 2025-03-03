import { useState, useEffect } from "react";
import { getAllPosts } from "../../services/apiPost"; 
import PostCard from "../../components/PostCard/PostCard";
import Filter from "../../components/Filter/Filter";
import Pagination from "../../components/Pagination/Pagination";
import "./Posts.css";

function Posts() {
  const postsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [postsData, setPostsData] = useState([]);  // Состояние для хранения постов
  const [loading, setLoading] = useState(true);  // Состояние для отслеживания загрузки данных
  const [filters, setFilters] = useState({
    dateFilterType: 'creation',
    tagsFilter: [],
    startDate: '',
    endDate: ''
  });

  // Функция для загрузки постов с учетом фильтров
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts(filters);
        setPostsData(data);  // Сохраняем посты в состояние
        setLoading(false);    // Останавливаем индикатор загрузки
      } catch (error) {
        console.error("Ошибка при получении постов:", error);
        setLoading(false); // В случае ошибки также прекращаем загрузку
      }
    };

    fetchPosts();  // Вызываем функцию при монтировании компонента
  }, [filters]);

  const totalPages = Math.ceil(postsData.length / postsPerPage);
  const currentPosts = postsData.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  if (loading) {
    return <div>Загрузка...</div>;  // Показываем загрузку, пока данные не загружены
  }

  return (
    <div className="posts-page">
      <div className="filters-container">
        <Filter
          filters={filters}
          setFilters={setFilters}
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
