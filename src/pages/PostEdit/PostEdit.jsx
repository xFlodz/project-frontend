import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FileInput from "../../components/FileInput/FileInput";
import ModalTags from "../../components/ModalTags/ModalTags";
import { getPostByAddress, updatePost } from "../../services/apiPost";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import TextEditor from "../../components/TextEditor/TextEditor";
import "./PostEdit.css";
import AddContentButton from "../../components/AddContentButton/AddContentButton";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function PostEdit({setNotification}) {
  const { address } = useParams();
  const [header, setHeader] = useState("");
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lead, setLead] = useState("");
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5000/api/file/";

  useEffect(() => {
    const initializePage = async () => {
      const role = localStorage.getItem("role");
      if (role !== "poster") {
        navigate("/");
        return;
      }

      try {
        const data = await getPostByAddress(address);
        console.log("Данные с сервера:", data);

        const startDate = parseDate(data.date_range?.start_date);
        const endDate = parseDate(data.date_range?.end_date);
        
        if (data.date_range?.start_date) {
          const isYearOnly = /^\d{4}$/.test(data.date_range.start_date);
          if (isYearOnly) {
            setLeftDateFormat('year');
            setLeftYear(data.date_range.start_date);
          } else {
            setLeftDateFormat('full');
            setLeftDate(startDate ? startDate.toISOString().split('T')[0] : '');
          }
        }

        if (data.date_range?.end_date) {
          const isYearOnly = /^\d{4}$/.test(data.date_range.end_date);
          if (isYearOnly) {
            setRightDateFormat('year');
            setRightYear(data.date_range.end_date);
          } else {
            setRightDateFormat('full');
            setRightDate(endDate ? endDate.toISOString().split('T')[0] : '');
          }
        }

        const mainImageBase64 = await urlToBase64(`${BASE_URL}${data.main_image}`);

        const updatedContent = await Promise.all(
          data.structure.map(async (item) => {
            if (item.type === "image" && item.src) {
              const srcBase64 = await urlToBase64(`${BASE_URL}${item.src}`);
              return { ...item, src: srcBase64 };
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
        setLead(data.lead);
      } catch (err) {
        setError("Ошибка загрузки поста.");
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [address, navigate]);

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


  const formatDateForInput = (date) => {
  if (!date) return "";
    const d = new Date(date);
  return d.toISOString().split("T")[0];
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
      console.error("Выбранные теги не являются списком:", selectedTags);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
  
    if (!header.trim()) {
      validationErrors.header = "Заголовок обязателен.";
    }

    if (!lead.trim()) {
      validationErrors.lead = "Лид обязателен.";
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
      setNotification({ message: "Исправьте все ошибки", type: "error" });
      setNotification(null);
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
      lead,
      main_image: mainImage,
      date_range: {
        start_date: formatDate(leftDate, leftYear, leftDateFormat),
        end_date: rightDate || rightYear ? formatDate(rightDate, rightYear, rightDateFormat) : ""
      },
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
      tags: tagIds,
    };
  
    console.log("Данные для обновления:", postData);
  
    try {
      const response = await updatePost(address, postData);
      console.log("Ответ от сервера:", response);
      setNotification({ message: "Пост успешно обновлен", type: "success" });
      navigate("/");
    } catch (error) {
      console.error("Ошибка при обновлении поста:", error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="create-post-page">
      <h1>Редактирование поста</h1>
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
          <textarea
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
          {errors.header && <p className="error-message">{errors.lead}</p>}
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
  
        <button type="submit" className="submit-button">
          Сохранить изменения
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

export default PostEdit;