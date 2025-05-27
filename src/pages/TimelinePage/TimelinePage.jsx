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
        const data = await getAllPosts({
          dateFilterType: "historical",
          tagsFilter: [],
          startDate: selectedRange?.startDate || "",
          endDate: selectedRange?.endDate || ""
        });
        setPosts(data);
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
    
    const [day, month, year] = dateString.split(".");
    
    return {
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      day: parseInt(day, 10),
      formatted: `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`
    };
  };

  const formatTimelineData = (posts) => {
    return posts.map(post => {
      const startDate = parseDate(post.date_range?.start_date);
      if (!startDate) return null;

      return {
        id: post.id,
        address: post.address,
        start_date: startDate,
        end_date: parseDate(post.date_range?.end_date) || null,
        text: {
          headline: post.header || "Без заголовка",
          text: (post.lead || "").substring(0, 200) + "..."
        },
        media: {
          url: post.main_image ? `http://localhost:5000/api/file/${post.main_image}` : "",
          caption: post.author || "Автор неизвестен"
        },
        formattedStartDate: startDate.formatted,
        formattedEndDate: post.date_range?.end_date ? parseDate(post.date_range.end_date).formatted : null
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
