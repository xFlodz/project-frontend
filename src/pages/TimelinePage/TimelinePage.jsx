import { useState, useEffect } from "react";
import { getAllPosts } from "../../services/apiPost";
import Timeline from "../../components/Timeline/Timeline";
import ImageModal from "../../components/ImageModal/ImageModal";
import "./TimelinePage.css";

function TimelinePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateFilterType: 'creation',
    tagsFilter: [],
    startDate: '',
    endDate: ''
  });

  // Состояние для управления модальным окном
  const [modalImageSrc, setModalImageSrc] = useState(null);
  const [modalDescription, setModalDescription] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts({
          filters
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

  // Функция для открытия модального окна
  const handleImageClick = (imageSrc, description) => {
    setModalImageSrc(imageSrc);
    setModalDescription(description);
  };

  // Функция для закрытия модального окна
  const closeModal = () => {
    setModalImageSrc(null);
    setModalDescription("");
  };

  // Функция для преобразования даты из формата dd.MM.yyyy в объект { year, month, day }
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split(".");
    return {
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      day: parseInt(day, 10)
    };
  };

  const formatTimelineData = (posts) => {
    return {
      title: {
        media: {
          url: "",
          caption: "",
          credit: ""
        },
        text: {
          headline: "Историческая лента",
          text: "События и факты."
        }
      },
      events: posts.map(post => {
        // Преобразуем даты из формата dd.MM.yyyy в объект { year, month, day }
        const startDate = parseDate(post.date_range?.start_date);
        const endDate = parseDate(post.date_range?.end_date);

        // Если startDate невалиден, пропускаем событие
        if (!startDate) return null;

        // Извлекаем текст из массива и объединяем в одну строку
        const postText = post.text && post.text.length > 0 
          ? post.text.map(item => item.text).join(" ") 
          : "Нет текста...";

        return {
          start_date: startDate,
          end_date: endDate || null, // end_date может быть null
          text: {
            headline: post.header || "Без заголовка",
            text: postText.substring(0, 200) + "..." // Берем первые 200 символов
          },
          media: {
            url: post.main_image ? `http://localhost:5000/api/file/${post.main_image}` : "",
            caption: post.author || "Автор неизвестен",
            credit: ""
          }
        };
      }).filter(event => event !== null) // Убираем события с невалидными датами
    };
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="timeline-page">
      <Timeline 
        data={formatTimelineData(posts)} 
        onImageClick={handleImageClick} // Передаем обработчик клика
      />
      {/* Модальное окно для изображений */}
      {modalImageSrc && (
        <ImageModal
          imageSrc={modalImageSrc}
          description={modalDescription}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default TimelinePage;