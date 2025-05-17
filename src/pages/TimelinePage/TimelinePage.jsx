import { useState, useEffect } from "react";
import { getAllPosts } from "../../services/apiPost";
import Timeline from "../../components/Timeline/Timeline";
import "./TimelinePage.css";

function TimelinePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters] = useState({
    dateFilterType: 'historical',
    tagsFilter: [],
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts({
          dateFilterType: 'historical',
          tagsFilter: [],
          startDate: '',
          endDate: ''
        });
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при получении постов:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filters]);

  const parseDate = (dateString) => {
    if (!dateString) return null;
    
    const [day, month, year] = dateString.split(".");
    
    const formattedDay = day.padStart(2, '0');
    const formattedMonth = month.padStart(2, '0');
    
    return {
      year: parseInt(year, 10),
      month: parseInt(month, 10), 
      day: parseInt(day, 10),    
      formatted: `${formattedDay}.${formattedMonth}.${year}` 
    };
  };

  const formatTimelineData = (posts) => {
    return posts.map(post => {
      const startDate = parseDate(post.date_range?.start_date);
      if (!startDate) return null;

      const postText = post.lead

      return {
        id: post.id,
        address: post.address,
        start_date: startDate,
        end_date: parseDate(post.date_range?.end_date) || null,
        text: {
          headline: post.header || "Без заголовка",
          text: postText.substring(0, 200) + "..."
        },
        media: {
          url: post.main_image ? `http://localhost:5000/api/file/${post.main_image}` : "",
          caption: post.author || "Автор неизвестен"
        },
        // Добавляем отформатированные даты для отображения
        formattedStartDate: startDate.formatted,
        formattedEndDate: post.date_range?.end_date ? parseDate(post.date_range.end_date).formatted : null
      };
    }).filter(Boolean);
  };

  if (loading) {
    return <div className="loading-message">Загрузка...</div>;
  }

  return (
    <div className="timeline-page">
      <h1>Историческая лента</h1>
      <Timeline 
        data={{ events: formatTimelineData(posts) }} 
      />
    </div>
  );
}

export default TimelinePage;