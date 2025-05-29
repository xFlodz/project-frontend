import { useState, useEffect } from "react";
import { getAllPosts } from "../../services/apiPost";
import Timeline from "../../components/Timeline/Timeline";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import "./TimelinePage.css";

function TimelinePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState(null);

  const generateRanges = () => {
    const ranges = [];
    let startYear = 1779;
    const currentYear = new Date().getFullYear();

    let endYear = 1800;
    if (endYear > currentYear) endYear = currentYear;

    ranges.push({
      label: `${startYear}-${endYear}`,
      startDate: `${startYear}-01-01`,
      endDate: `${endYear}-12-31`
    });

    startYear = endYear + 1;

    while (startYear < currentYear) {
      endYear = startYear + 19;
      if (endYear > currentYear) {
        endYear = currentYear;
      }
      ranges.push({
        label: `${startYear}-${endYear}`,
        startDate: `${startYear}-01-01`,
        endDate: `${endYear}-12-31`
      });
      startYear = endYear + 1;
    }

    return ranges;
  };

  const ranges = generateRanges();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const allPosts = await getAllPosts({
          dateFilterType: "historical",
          tagsFilter: []
        });

        const filteredPosts = allPosts.filter(post => {
          if (!post.date_range) return false;
          
          const dateRange = typeof post.date_range === 'string' 
            ? JSON.parse(post.date_range) 
            : post.date_range;
          
          const postStartDate = parseDate(dateRange.start_date);
          if (!postStartDate) return false;

          if (!selectedRange) return true;

          const postYear = postStartDate.year;
          const rangeStartYear = parseInt(selectedRange.startDate.split('-')[0], 10);
          const rangeEndYear = parseInt(selectedRange.endDate.split('-')[0], 10);

          return postYear >= rangeStartYear && postYear <= rangeEndYear;
        });

        setPosts(filteredPosts);
      } catch (error) {
        console.error("Ошибка при получении постов:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [selectedRange]);

  const parseDate = (dateString) => {
    if (!dateString) return null;
    
    let parts = [];
    
    if (/^\d{4}$/.test(dateString)) {
      return {
        year: parseInt(dateString, 10),
        month: 1,
        day: 1,
        formatted: dateString
      };
    }
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      parts = dateString.split('-');
      return {
        year: parseInt(parts[0], 10),
        month: parseInt(parts[1], 10),
        day: parseInt(parts[2], 10),
        formatted: `${parts[2]}.${parts[1]}.${parts[0]}`
      };
    }
    
    if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(dateString)) {
      parts = dateString.split('.');
      return {
        year: parseInt(parts[2], 10),
        month: parseInt(parts[1], 10),
        day: parseInt(parts[0], 10),
        formatted: `${parts[0].padStart(2, '0')}.${parts[1].padStart(2, '0')}.${parts[2]}`
      };
    }
    
    console.warn("Неизвестный формат даты:", dateString);
    return null;
  };

  const formatTimelineData = (posts) => {
    return posts.map(post => {
      if (!post.date_range) return null;
      
      const dateRange = typeof post.date_range === 'string' 
        ? JSON.parse(post.date_range) 
        : post.date_range;
      
      const startDate = parseDate(dateRange.start_date);
      if (!startDate) return null;

      return {
        id: post.id,
        address: post.address,
        start_date: startDate,
        end_date: parseDate(dateRange.end_date) || null,
        text: {
          headline: post.header || "Без заголовка",
          text: (post.lead || "").substring(0, 200) + "..."
        },
        media: {
          url: post.main_image ? `http://localhost:5000/api/file/${post.main_image}` : "",
          caption: post.author || "Автор неизвестен"
        },
        formattedStartDate: startDate.formatted,
        formattedEndDate: dateRange.end_date ? parseDate(dateRange.end_date)?.formatted : null
      };
    }).filter(Boolean);
  };

  return (
    <div className="timeline-page">
      <h1>Историческая лента</h1>

      <div className="date-range-filter">
        {ranges.map(range => (
          <button
            key={range.label}
            className={selectedRange?.startDate === range.startDate ? "active" : ""}
            onClick={() => setSelectedRange(range)}
          >
            {range.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Timeline data={{ events: formatTimelineData(posts) }} />
      )}
    </div>
  );
}

export default TimelinePage;