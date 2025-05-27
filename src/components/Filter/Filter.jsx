import React, { useState, useEffect } from "react";
import "./Filter.css";
import { getAllTags } from "../../services/apiTag";
import { getAllPosts } from "../../services/apiPost";

function Filter({ filters, setFilters }) {
  const { dateFilterType, tagsFilter, startDate, endDate } = filters;
  const [tags, setTags] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [localFilters, setLocalFilters] = useState({
    dateFilterType,
    tagsFilter,
    startDate,
    endDate,
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getAllTags();
        setTags(data);
      } catch (error) {
        console.error("Ошибка при загрузке тегов:", error);
      }
    };
    fetchTags();

    const handleResize = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobile(mobileView);
      if (!mobileView) setIsFilterVisible(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTag = (tagId) => {
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      tagsFilter: prevFilters.tagsFilter.includes(tagId)
        ? prevFilters.tagsFilter.filter((id) => id !== tagId)
        : [...prevFilters.tagsFilter, tagId],
    }));
  };

  const handleApplyFilters = async () => {
    setFilters(localFilters);

    try {
      const response = await getAllPosts({
        dateFilterType: localFilters.dateFilterType,
        tagsFilter: localFilters.tagsFilter,
        startDate: localFilters.startDate,
        endDate: localFilters.endDate,
      });
      console.log("Полученные посты:", response);
    } catch (error) {
      console.error("Ошибка при получении постов:", error);
    }
  };

  return (
    <div className="filter-container">
      {isMobile && (
        <button className="filter-toggle" onClick={() => setIsFilterVisible(!isFilterVisible)}>
          {isFilterVisible ? "Скрыть фильтры" : "Показать фильтры"}
        </button>
      )}

      <div className={`filters ${isFilterVisible || !isMobile ? "visible" : "hidden"}`}>
        <h3>Фильтры</h3>

        <label>Фильтр по дате:</label>
        <select
          value={localFilters.dateFilterType}
          onChange={(e) => setLocalFilters({ ...localFilters, dateFilterType: e.target.value })}
        >
          <option value="creation">Дата создания</option>
          <option value="historical">Историческая дата</option>
        </select>

        <label>Временной промежуток:</label>
        <div className="date-range">
          <input
            type="date"
            value={localFilters.startDate}
            onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value })}
          />
          <span>—</span>
          <input
            type="date"
            value={localFilters.endDate}
            onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value })}
          />
        </div>

        <label>Теги:</label>
        <div className="tags-container tags-scrollable">
          {tags.map((tag) => (
            <label key={tag.id} className="tag-checkbox">
              <input
                type="checkbox"
                checked={localFilters.tagsFilter.includes(tag.id)}
                onChange={() => toggleTag(tag.id)}
              />
              {tag.name}
            </label>
          ))}
        </div>
        <button onClick={handleApplyFilters}>Найти</button>
      </div>
    </div>
  );
}

export default Filter;
