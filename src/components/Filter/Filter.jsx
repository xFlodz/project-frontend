import React, { useState, useEffect, useRef } from "react";
import "./Filter.css";
import { getAllTags } from "../../services/apiTag";
import { getAllPosts, searchPosts, getSearchSuggestions } from "../../services/apiPost";

function Filter({ filters, setFilters, onSearchResults  }) {
  const { dateFilterType, tagsFilter, startDate, endDate } = filters;
  const [tags, setTags] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [lastSelectedSuggestion, setLastSelectedSuggestion] = useState(null);
  const [lastSelectionTime, setLastSelectionTime] = useState(0);
  const timerRef = useRef(null);

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

  const handleApplyFilters = async () => {
    setShowSuggestions(false);
    
    try {
      let response;
      if (searchQuery) {
        response = await searchPosts({
          query: searchQuery,
          dateFilterType: localFilters.dateFilterType,
          tagsFilter: localFilters.tagsFilter,
          startDate: localFilters.startDate,
          endDate: localFilters.endDate,
        });
        if (typeof onSearchResults === 'function') {
          onSearchResults(response);
        }
      } else {
        if (typeof onSearchResults === 'function') {
          onSearchResults(null);
        }
      }
      
      setFilters(localFilters);
    } catch (error) {
      console.error("Ошибка при получении постов:", error);
    }
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

  const handleInputFocus = () => {
    const isSameAsLastSelected = searchQuery === lastSelectedSuggestion;
    const isTooSoon = Date.now() - lastSelectionTime < 1000;
    
    if (!(isSameAsLastSelected && isTooSoon) && searchQuery.length > 1) {
      setShowSuggestions(true);
    }
  };


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
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  onClick={(e) => handleSuggestionClick(suggestion, e)}
                >
                  {suggestion}
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
        <button onClick={handleApplyFilters}>Найти</button>
      </div>
    </div>
  );
}

export default Filter;