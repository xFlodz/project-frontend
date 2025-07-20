import React, { useState, useEffect, useRef } from "react";
import "./Filter.css";
import { getAllTags } from "../../services/apiTag";
import { getAllPosts, searchPosts, getSearchSuggestions } from "../../services/apiPost";

function Filter({ filters, setFilters, searchQuery, setSearchQuery, onApplyFilters }) {
  const { dateFilterType, tagsFilter, startDate, endDate } = filters;
  const [tags, setTags] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [lastSelectedSuggestion, setLastSelectedSuggestion] = useState(null);
  const [lastSelectionTime, setLastSelectionTime] = useState(0);
  const timerRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [localFilters, setLocalFilters] = useState(filters);


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

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const isSameAsLastSelected = searchQuery === lastSelectedSuggestion;
      const isTooSoon = Date.now() - lastSelectionTime < 1000;
      
      if (searchQuery.length > 1 && !(isSameAsLastSelected && isTooSoon)) {
        try {
          const data = await getSearchSuggestions(searchQuery);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Ошибка при получении подсказок:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(timerRef.current);
  }, [searchQuery, lastSelectedSuggestion, lastSelectionTime]);

  const toggleTag = (tagId) => {
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      tagsFilter: prevFilters.tagsFilter.includes(tagId)
        ? prevFilters.tagsFilter.filter((id) => id !== tagId)
        : [...prevFilters.tagsFilter, tagId],
    }));
  };


  const handleSuggestionClick = (suggestion, e) => {
    e.stopPropagation();
    setSearchQuery(suggestion);
    setLastSelectedSuggestion(suggestion);
    setLastSelectionTime(Date.now());
    setShowSuggestions(false);
    
    if (searchRef.current) {
      const input = searchRef.current.querySelector('input');
      if (input) {
        input.blur();
      }
    }
  };

  const applyFiltersLocally = () => {
    setShowSuggestions(false);
    onApplyFilters(localFilters, searchQuery);
    setFilters(localFilters);
  };

  const handleInputFocus = () => {
    const isSameAsLastSelected = searchQuery === lastSelectedSuggestion;
    const isTooSoon = Date.now() - lastSelectionTime < 1000;
    
    if (!(isSameAsLastSelected && isTooSoon) && searchQuery.length > 1) {
      setShowSuggestions(true);
    }
  };

  function stripHtmlTags(str) {
    return str.replace(/<[^>]*>?/gm, '');
  }

  function trimSuggestion(text) {
    const cleanText = stripHtmlTags(text);
    return cleanText.length > 20 ? cleanText.slice(0, 20) : cleanText;
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      handleApplyFilters();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      if (searchRef.current) {
        const input = searchRef.current.querySelector('input');
        if (input) {
          input.blur();
        }
      }
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleApplyClick = () => {
    onApplyFilters(filters, searchQuery);
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

        <div className="search-box" ref={searchRef}>
          <input
            type="text"
            placeholder="Поиск по статьям..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={(e) => handleSuggestionClick(trimSuggestion(suggestion), e)}>
                  {trimSuggestion(suggestion) + "..."}
                </li>
              ))}
            </ul>
          )}
        </div>

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
        <button onClick={applyFiltersLocally}>Найти</button>
      </div>
    </div>
  );
}

export default Filter;