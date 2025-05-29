import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileInput from "../../components/FileInput/FileInput";
import ModalTags from "../../components/ModalTags/ModalTags";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import AddContentButton from "../../components/AddContentButton/AddContentButton";
import { FaTrash } from "react-icons/fa";
import TextEditor from "../../components/TextEditor/TextEditor";
import "./PostsCreate.css";
import { createPost } from "../../services/apiPost";


function CreatePost() {
  const [isLoading, setIsLoading] = useState(false);
  const [showImageEnhanceHint, setShowImageEnhanceHint] = useState(false);
  const [header, setHeader] = useState("");
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(null);
  const [content, setContent] = useState([]);
  const [tags, setTags] = useState([]);
  const [leftDate, setLeftDate] = useState('');
  const [rightDate, setRightDate] = useState('');
  const [leftYear, setLeftYear] = useState('');
  const [rightYear, setRightYear] = useState('');
  const [leftDateFormat, setLeftDateFormat] = useState('full');
  const [rightDateFormat, setRightDateFormat] = useState('full');
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lead, setLead] = useState("");

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
    updatedContent[index].value = value;
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
      console.error("Выбранные теги не являются списком:", selectedTags);
    }
    setIsModalOpen(false);
  };

  const removeTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!header.trim()) validationErrors.header = "Заголовок обязателен.";
    if (!lead.trim()) validationErrors.lead = "Лид обязателен.";

    const hasText = content.some((item) => item.type === "text" && item.value.trim() !== "");
    if (!hasText) validationErrors.content = "Пост должен содержать текст.";

    if (!mainImage) validationErrors.mainImage = "Основное изображение обязательно.";

    const allContentLoaded = content.every(
      (item) => (item.type !== "image" && item.type !== "video") || item.src
    );
    if (!allContentLoaded) validationErrors.contentImages = "Все изображения и видео должны быть загружены.";

    if (leftDateFormat === 'year' && rightDateFormat === 'year' && rightYear && leftYear && rightYear < leftYear) {
      validationErrors.dateRange = "Год окончания не может быть раньше года начала";
    }

    if (leftDateFormat === 'full' && rightDateFormat === 'full' && rightDate && leftDate && new Date(rightDate) < new Date(leftDate)) {
      validationErrors.dateRange = "Дата окончания не может быть раньше даты начала";
    }

    if (leftDateFormat === 'year' && rightDateFormat === 'full' && rightDate && leftYear && new Date(rightDate).getFullYear() < parseInt(leftYear)) {
      validationErrors.dateRange = "Дата окончания не может быть раньше года начала";
    }

    if (leftDateFormat === 'full' && rightDateFormat === 'year' && rightYear && leftDate && parseInt(rightYear) < new Date(leftDate).getFullYear()) {
      validationErrors.dateRange = "Год окончания не может быть раньше даты начала";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formatDate = (date, year, format) => {
      if (format === 'year') {
        return year || "";
      }
      return date || "";
    };

    const tagIds = tags.map(tag => tag.id);
    const postData = {
      header,
      main_image: mainImage,
      left_date: formatDate(leftDate, leftYear, leftDateFormat),
      right_date: rightDate || rightYear ? formatDate(rightDate, rightYear, rightDateFormat) : "",
      content,
      tags: tagIds,
      lead
    };

    console.log("Данные для отправки:", postData);

    setIsLoading(true);
    setShowImageEnhanceHint(false);

    const timeoutId = setTimeout(() => {
      setShowImageEnhanceHint(true);
    }, 2000);

    try {
      const response = await createPost(postData);
      clearTimeout(timeoutId);
      console.log("Ответ от сервера:", response);
      navigate("/", { state: { notification: { message: "Пост успешно создан.", type: "success" } } });
    } catch (error) {
      console.error("Ошибка при создании поста:", error);
      navigate("/", { state: { notification: { message: "Ошибка при создании поста", type: "error" } } });
    } finally {
      setIsLoading(false);
      setShowImageEnhanceHint(false);
    }
  };

  const handleLeftYearChange = (e) => {
    const value = e.target.value;
    setLeftYear(value);
    if (rightDateFormat === 'year' && rightYear && value && rightYear < value) {
      setRightYear(value);
    }
  };

  const handleRightYearChange = (e) => {
    const value = e.target.value;
    if (leftDateFormat === 'year' && leftYear && value && value < leftYear) {
      setErrors((prev) => ({...prev, dateRange: "Год окончания не может быть раньше года начала"}));
    } else {
      setErrors((prev) => ({...prev, dateRange: ""}));
      setRightYear(value);
    }
  };

  return (
    <div className="create-post-page">
      <h1>Создание поста</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="header">Заголовок</label>
          <input
            type="text"
            id="header"
            value={header}
            placeholder="Введите заголовок поста"
            maxLength={150}
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
        
        <div className="form-group">
            <label htmlFor="lead">Лид</label>
            <input
              type="text"
              id="lead"
              value={lead}
              placeholder="Введите краткое описание к посту"
              maxLength={250}
              onChange={(e) => {
                setLead(e.target.value);
                if (e.target.value.trim()) {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    lead: "",
                  }));
                }
              }}
              className={errors.lead ? "error" : ""}
            />
            {errors.lead && <p className="error-message">{errors.lead}</p>}
          </div>
  
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
  
        <div className="form-group">
          <label>Диапазон дат</label>
          {errors.dateRange && <p className="error-message">{errors.dateRange}</p>}
          <div className="date-range-container">
            <div className="date-field">
              <div className="input-container">
                <input
                  type={leftDateFormat === 'full' ? "date" : "number"}
                  value={leftDateFormat === 'full' ? leftDate : leftYear}
                  min={leftDateFormat === 'full' ? '1779-01-01' : '1779'}
                  max={leftDateFormat === 'full' ? new Date().toISOString().split('T')[0] : new Date().getFullYear()}
                  onChange={(e) => leftDateFormat === 'full' ? setLeftDate(e.target.value) : handleLeftYearChange(e)}
                  required
                  className="date-input"
                  placeholder={leftDateFormat === 'year' ? "Год" : ""}
                />
              </div>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="leftDateFormat"
                    checked={leftDateFormat === 'full'}
                    onChange={() => setLeftDateFormat('full')}
                  />
                  <span>Полная дата</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="leftDateFormat"
                    checked={leftDateFormat === 'year'}
                    onChange={() => setLeftDateFormat('year')}
                  />
                  <span>Только год</span>
                </label>
              </div>
            </div>
            
            <span className="date-separator">—</span>
            
            <div className="date-field">
              <div className="input-container">
                <input
                  type={rightDateFormat === 'full' ? "date" : "number"}
                  value={rightDateFormat === 'full' ? rightDate : rightYear}
                  min={rightDateFormat === 'full' ? leftDate || '1779-01-01' : leftYear || '1779'}
                  max={rightDateFormat === 'full' ? new Date().toISOString().split('T')[0] : new Date().getFullYear()}
                  onChange={(e) => rightDateFormat === 'full' ? setRightDate(e.target.value) : handleRightYearChange(e)}
                  className="date-input"
                  placeholder={rightDateFormat === 'year' ? "Год" : ""}
                />
              </div>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="rightDateFormat"
                    checked={rightDateFormat === 'full'}
                    onChange={() => setRightDateFormat('full')}
                  />
                  <span>Полная дата</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="rightDateFormat"
                    checked={rightDateFormat === 'year'}
                    onChange={() => setRightDateFormat('year')}
                  />
                  <span>Только год</span>
                </label>
              </div>
            </div>
          </div>
        </div>
  
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
        {isLoading && (
          <p className="loading-message">Создание поста...</p>
        )}

        {showImageEnhanceHint && (
          <p className="hint-message">Изображение слишком маленькое, повышение качества...</p>
        )}
  
        <button type="submit" className="submit-button">
          Создать пост
        </button>
      </form>
  
      <ModalTags
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectTags={handleTagSelect}
        selectedTags={tags}
      />
    </div>
  );
}

export default CreatePost;