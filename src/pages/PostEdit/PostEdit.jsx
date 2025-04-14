import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FileInput from "../../components/FileInput/FileInput";
import ModalTags from "../../components/ModalTags/ModalTags";
import { getPostByAddress, updatePost } from "../../services/apiPost";
import TextEditor from "../../components/TextEditor/TextEditor";
import "./PostEdit.css";
import AddContentButton from "../../components/AddContentButton/AddContentButton";
import { FaTrash } from "react-icons/fa";

function PostEdit() {
  const { address } = useParams();
  const [header, setHeader] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [content, setContent] = useState([]);
  const [tags, setTags] = useState([]);
  const [leftDate, setLeftDate] = useState(null);
  const [rightDate, setRightDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:5000/api/file/";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostByAddress(address);
        console.log("Данные с сервера:", data);

        const startDate = parseDate(data.date_range?.start_date);
        const endDate = parseDate(data.date_range?.end_date);

        const mainImageBase64 = await urlToBase64(`${BASE_URL}${data.main_image}`);

        const updatedContent = await Promise.all(
          data.structure.map(async (item) => {
            if (item.type === "image" && item.src) {
              const srcBase64 = await urlToBase64(`${BASE_URL}${item.src}`);
              return { ...item, src: srcBase64};
            }
            return item;
          })
        );

        const formattedTags = data.tags.map(tag => ({
          id: tag.tag_id,
          name: tag.tag_name,
        }));

        setHeader(data.header);
        setMainImage(mainImageBase64);
        setContent(updatedContent);
        setTags(formattedTags);
        setLeftDate(startDate);
        setRightDate(endDate);
      } catch (err) {
        setError("Ошибка загрузки поста.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [address]);

  const urlToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Ошибка при преобразовании изображения в base64:", error);
      return null;
    }
  };

  // Обработчики событий (аналогичные PostCreate)
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      mainImage: file ? "" : "Основное изображение обязательно.",
    }));
  };

  const handleContentImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedContent = [...content];
        updatedContent[index].src = reader.result;
        setContent(updatedContent);
      };
      reader.readAsDataURL(file);
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      contentImages: "",
    }));
  };

  const handleVideoChange = (index, e) => {
    const videoUrl = e.target.value;
    let embedUrl = "";

    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const vkRegex = /(?:https?:\/\/)?(?:www\.)?(?:vk\.com\/video|vkvideo\.ru\/video)(-?\d+_\d+)/;
    const rutubeRegex = /(?:https?:\/\/)?(?:www\.)?rutube\.ru\/video\/([a-zA-Z0-9]+)\/?/;

    const isYoutube = youtubeRegex.test(videoUrl);
    const isVK = vkRegex.test(videoUrl);
    const isRutube = rutubeRegex.test(videoUrl);

    if (!isYoutube && !isVK && !isRutube) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        video: "Введите корректную ссылку на YouTube, VK или Rutube.",
      }));
      return;
    }

    if (isYoutube) {
      const videoId = videoUrl.match(youtubeRegex)[1];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    if (isVK) {
      const videoId = videoUrl.match(vkRegex)[1];
      embedUrl = `https://vk.com/video_ext.php?oid=${videoId.split('_')[0]}&id=${videoId.split('_')[1]}`;
    }

    if (isRutube) {
      const videoId = videoUrl.match(rutubeRegex)[1];
      embedUrl = `https://rutube.ru/embed/${videoId}`;
    }

    const updatedContent = [...content];
    updatedContent[index].src = embedUrl;
    setContent(updatedContent);

    setErrors((prevErrors) => ({
      ...prevErrors,
      video: "",
    }));
  };

  const addText = () => {
    setContent([...content, { type: "text", value: "" }]);
  };

  const addImage = () => {
    setContent([...content, { type: "image", src: "", description: "" }]);
  };

  const addVideo = () => {
    setContent([...content, { type: "video", src: "" }]);
  };

  const handleTextChange = (index, value) => {
    const updatedContent = [...content];
    updatedContent[index].text = value;
    setContent(updatedContent);
    if (value.replace(/<[^>]*>/g, '').trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        content: "",
      }));
    }
  };

  const handleImageDescriptionChange = (index, value) => {
    const updatedContent = [...content];
    updatedContent[index].description = value;
    setContent(updatedContent);
  };

  const removeContent = (index) => {
    const updatedContent = content.filter((_, i) => i !== index);
    if (content[index].type === "image" && content[index].src) {
      URL.revokeObjectURL(content[index].src);
    }
    setContent(updatedContent);
  };

  const handleTagSelect = (selectedTags) => {
    if (Array.isArray(selectedTags)) {
      setTags(selectedTags);
    } else {
      console.error("Selected tags is not an array:", selectedTags);
    }
    setIsModalOpen(false);
  };

  const removeTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split(".");
    return new Date(`${year}-${month}-${day}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
  
    if (!header.trim()) {
      validationErrors.header = "Заголовок обязателен.";
    }
  
    const hasText = content.some((item) => item.type === "text" && item.text.trim() !== "");
    if (!hasText) {
      validationErrors.content = "Пост должен содержать текст.";
    }
  
    if (!mainImage) {
      validationErrors.mainImage = "Основное изображение обязательно.";
    }
  
    const allContentLoaded = content.every(
      (item) => (item.type !== "image" && item.type !== "video") || item.src
    );
    if (!allContentLoaded) {
      validationErrors.contentImages = "Все изображения и видео должны быть загружены.";
    }
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const tagIds = tags.map(tag => tag.id);
  
    const postData = {
      header,
      main_image: mainImage,
      left_date: leftDate ? leftDate.toLocaleDateString("ru-RU") : "",
      right_date: rightDate ? rightDate.toLocaleDateString("ru-RU") : "",
      content: content.map(item => {
        if (item.type === "text") {
          return { type: "text", value: item.text };
        } else if (item.type === "image") {
          return { type: "image", src: item.src, description: item.description };
        } else if (item.type === "video") {
          return { type: "video", src: item.src };
        }
        return item;
      }),
      tags: tagIds, // Отправляем только идентификаторы тегов
    };
  
    console.log("Данные для обновления:", postData);
  
    try {
      const response = await updatePost(address, postData);
      console.log("Ответ от сервера:", response);
    } catch (error) {
      console.error("Ошибка при обновлении поста:", error);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="create-post-page">
      <h1>Редактирование поста</h1>
      <form onSubmit={handleSubmit}>
        {/* Заголовок */}
        <div className="form-group">
          <label htmlFor="header">Заголовок</label>
          <input
            type="text"
            id="header"
            value={header}
            onChange={(e) => {
              setHeader(e.target.value);
              if (e.target.value.trim()) {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  header: "",
                }));
              }
            }}
            className={errors.header ? "error" : ""}
          />
          {errors.header && <p className="error-message">{errors.header}</p>}
        </div>
  
        {/* Основное изображение */}
        <div className="form-group-image">
          <label htmlFor="main-image">Основное изображение</label>
          <div className="file-input">
            <FileInput
              id="main-image"
              accept="image/*"
              onChange={handleMainImageChange}
              buttonText="Выберите основное изображение"
            />
          </div>
          {mainImage ? (
            <img src={mainImage} alt="Основное изображение" className="main-image" />
          ) : (
            <p>Основное изображение не выбрано</p>
          )}
          {errors.mainImage && <p className="error-message">{errors.mainImage}</p>}
        </div>
  
        {/* Контент поста */}
        <div className="form-group">
          <label>Контент поста</label>
          {content.map((item, index) => (
            <div key={index} className="content-item">
              {item.type === "text" ? (
                <div className="text-item-wrapper">
                  <div className="text-item">
                    <TextEditor
                      value={item.text}
                      onChange={(value) => handleTextChange(index, value)}
                      className={errors.content ? "error" : ""}
                    />
                  </div>
                  <button type="button" onClick={() => removeContent(index)} className="delete-button">
                    <FaTrash />
                  </button>
                </div>
              ) : item.type === "image" ? (
                <div className="image-item">
                  <div className="file-input">
                    <FileInput
                      id={`content-image-${index}`}
                      accept="image/*"
                      onChange={(e) => handleContentImageChange(index, e)}
                      buttonText={`Выберите изображение`}
                    />
                  </div>
                  {item.src ? (
                    <div>
                      <img src={item.src} alt={`Изображение ${index + 1}`} />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleImageDescriptionChange(index, e.target.value)}
                        placeholder="Введите описание изображения"
                      />
                    </div>
                  ) : (
                    <p>Изображение не загружено</p>
                  )}
                  <button type="button" onClick={() => removeContent(index)} className="delete-button">
                    <FaTrash />
                  </button>
                </div>
              ) : item.type === "video" ? (
                <div className="video-item">
                  <div className="video-item-content">
                    <input
                      type="text"
                      value={item.src}
                      onChange={(e) => handleVideoChange(index, e)}
                      placeholder="Введите ссылку на видео (например, YouTube)"
                    />
                    {item.src && (
                      <div className="video-preview">
                        <iframe
                          width="560"
                          height="315"
                          src={item.src}
                          title="Видео"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeContent(index)} 
                    className="delete-button"
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : null}
            </div>
          ))}
          {errors.content && <p className="error-message">{errors.content}</p>}
          {errors.contentImages && <p className="error-message">{errors.contentImages}</p>}
          <AddContentButton onAddText={addText} onAddImage={addImage} onAddVideo={addVideo} />
        </div>
  
        {/* Диапазон дат */}
        <div className="form-group">
          <label>Диапазон дат</label>
          <div className="date-picker-container">
            <ReactDatePicker
              selected={leftDate}
              onChange={(date) => setLeftDate(date)}
              placeholderText="Начальная дата"
              dateFormat="dd/MM/yyyy"
              selectsStart
              startDate={leftDate}
              endDate={rightDate}
              required
            />
            <span>—</span>
            <ReactDatePicker
              selected={rightDate}
              onChange={(date) => setRightDate(date)}
              placeholderText="Конечная дата"
              dateFormat="dd/MM/yyyy"
              selectsEnd
              startDate={leftDate}
              endDate={rightDate}
              minDate={leftDate}
              required
            />
          </div>
        </div>
  
        {/* Теги */}
        <div className="form-group">
          <div className="tags-container">
            {tags.map((tag, index) => (
              <div key={index} className="tag">
                {typeof tag === 'object' ? tag.name : tag}
                <button type="button" onClick={() => removeTag(index)} className="delete-tag-button">
                  ×
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setIsModalOpen(true)} className="add-button">
            Добавить теги
          </button>
        </div>
  
        {/* Кнопка отправки */}
        <button type="submit" className="submit-button">
          Сохранить изменения
        </button>
      </form>
  
      {/* Модальное окно для выбора тегов */}
      <ModalTags
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectTags={handleTagSelect}
        selectedTags={tags}
      />
    </div>
  );
}

export default PostEdit;