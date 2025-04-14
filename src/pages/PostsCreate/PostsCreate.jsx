import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import FileInput from "../../components/FileInput/FileInput";
import ModalTags from "../../components/ModalTags/ModalTags";
import AddContentButton from "../../components/AddContentButton/AddContentButton"; // Импортируем новый компонент
import { FaTrash } from "react-icons/fa"; // Импортируем иконку мусорного ведра
import TextEditor from "../../components/TextEditor/TextEditor";
import "./PostsCreate.css";
import { createPost } from "../../services/apiPost";


function CreatePost() {
  const [header, setHeader] = useState("");
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(null);
  const [content, setContent] = useState([]);
  const [tags, setTags] = useState([]); // Инициализация тегов как массива
  const [leftDate, setLeftDate] = useState(null);
  const [rightDate, setRightDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для управления модальным окном

  // Обработчик изменения основного изображения
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImage(reader.result); // Сохраняем base64
      };
      reader.readAsDataURL(file); // Читаем файл как base64
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      mainImage: file ? "" : "Основное изображение обязательно.",
    }));
  };

  // Обработчик изменения изображений в контенте
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

  // Обработчик изменения видео
  const handleVideoChange = (index, e) => {
    const videoUrl = e.target.value;
    let embedUrl = "";

    // Регулярные выражения для проверки ссылок
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const vkRegex = /(?:https?:\/\/)?(?:www\.)?(?:vk\.com\/video|vkvideo\.ru\/video)(-?\d+_\d+)/;
    const rutubeRegex = /(?:https?:\/\/)?(?:www\.)?rutube\.ru\/video\/([a-zA-Z0-9]+)\/?/;

    const isYoutube = youtubeRegex.test(videoUrl);
    const isVK = vkRegex.test(videoUrl);
    const isRutube = rutubeRegex.test(videoUrl);

    if (!isYoutube && !isVK && !isRutube) {
      // Если ссылка не соответствует ни одному из форматов
      setErrors((prevErrors) => ({
        ...prevErrors,
        video: "Введите корректную ссылку на YouTube, VK или Rutube.",
      }));
      return;
    }

    // Обработка YouTube
    if (isYoutube) {
      const videoId = videoUrl.match(youtubeRegex)[1];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    // Обработка VK
    if (isVK) {
      const videoId = videoUrl.match(vkRegex)[1];
      embedUrl = `https://vk.com/video_ext.php?oid=${videoId.split('_')[0]}&id=${videoId.split('_')[1]}`;
    }

    // Обработка Rutube
    if (isRutube) {
      const videoId = videoUrl.match(rutubeRegex)[1];
      embedUrl = `https://rutube.ru/embed/${videoId}`;
    }

    // Обновляем состояние
    const updatedContent = [...content];
    updatedContent[index].src = embedUrl;
    setContent(updatedContent);

    // Очищаем ошибку, если ссылка корректна
    setErrors((prevErrors) => ({
      ...prevErrors,
      video: "",
    }));
  };

  // Добавление текстового блока
  const addText = () => {
    setContent([...content, { type: "text", value: "" }]);
  };

  // Добавление изображения
  const addImage = () => {
    setContent([...content, { type: "image", src: "", description: "" }]);
  };

  // Добавление видео
  const addVideo = () => {
    setContent([...content, { type: "video", src: "" }]);
  };

  // Изменение текста
  const handleTextChange = (index, value) => {
    const updatedContent = [...content];
    updatedContent[index].value = value;
    setContent(updatedContent);
    if (value.replace(/<[^>]*>/g, '').trim()) { // Проверяем текст без HTML-тегов
      setErrors((prevErrors) => ({
        ...prevErrors,
        content: "",
      }));
    }
  };

  // Изменение описания изображения
  const handleImageDescriptionChange = (index, value) => {
    const updatedContent = [...content];
    updatedContent[index].description = value;
    setContent(updatedContent);
  };

  // Удаление элемента контента
  const removeContent = (index) => {
    const updatedContent = content.filter((_, i) => i !== index);
    if (content[index].type === "image" && content[index].src) {
      URL.revokeObjectURL(content[index].src);
    }
    setContent(updatedContent);
  };

  // Обработчик выбора тегов из модального окна
  const handleTagSelect = (selectedTags) => {
    if (Array.isArray(selectedTags)) {
      setTags(selectedTags); // Заменяем текущие теги на выбранные
    } else {
      console.error("Selected tags is not an array:", selectedTags);
    }
    setIsModalOpen(false); // Закрываем модальное окно
  };

  // Удаление тега
  const removeTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
  
    if (!header.trim()) {
      validationErrors.header = "Заголовок обязателен.";
    }
  
    const hasText = content.some((item) => item.type === "text" && item.value.trim() !== "");
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
  
    // Преобразуем теги в массив идентификаторов
    const tagIds = tags.map(tag => tag.id);
  
    // Создаем объект данных для отправки
    const postData = {
      header,
      main_image: mainImage, // Теперь это base64
      left_date: leftDate ? leftDate.toLocaleDateString() : "",
      right_date: rightDate ? rightDate.toLocaleDateString() : "",
      content,
      tags: tagIds, // Отправляем только идентификаторы тегов
    };
  
    console.log("Данные для отправки:", postData);
  
    try {
      const response = await createPost(postData); // Отправляем JSON на сервер
      console.log("Ответ от сервера:", response);
      navigate("/", { state: { notification: { message: "Пост успешно создан.", type: "success" } } });
    } catch (error) {
      console.error("Ошибка при создании поста:", error);
      navigate("/", { state: { notification: { message: "Ошибка при создании поста", type: "error" } } });
    }
  };

  return (
    <div className="create-post-page">
      <h1>Создание поста</h1>
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
                      value={item.value}
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
          Создать пост
        </button>
      </form>
  
      {/* Модальное окно для выбора тегов */}
      <ModalTags
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectTags={handleTagSelect}
        selectedTags={tags} // Передаем текущие теги в модальное окно
      />
    </div>
  );
}

export default CreatePost;