import { useState } from "react";
import { Link } from "react-router-dom";
import "./Timeline.css";
import parse from 'html-react-parser';
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"

function Timeline({ data }) {
  if (!data || !data.events) {
    return <LoadingSpinner />
  }

  return (
    <div className="timeline-container">
      <div className="timeline-line"></div>
      <div className="timeline-events">
        {data.events.map((event, index) => {
          const year = event.start_date?.year || '';
          return (
            <TimelineEvent 
              key={index} 
              event={event} 
              isEven={index % 2 === 0}
              year={year}
            />
          );
        })}
      </div>
    </div>
  );
}

function TimelineEvent({ event, isEven, year }) {
  const [isHovered, setIsHovered] = useState(false);

  const dateString = event.formattedEndDate
    ? `${event.formattedStartDate} - ${event.formattedEndDate}`
    : event.formattedStartDate;

  return (
    <div 
      className={`timeline-event ${isEven ? "timeline-event-left" : "timeline-event-right"} ${isHovered ? "timeline-event-expanded" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEven ? (
        <>
          <Link 
            to={`/post/${event.address}`}
            className="timeline-event-content"
          >
            <div className="timeline-event-date">{dateString}</div>
            <h3 className="timeline-event-title">{event.text.headline}</h3>
            
            <div className="timeline-event-image-wrapper">
              {event.media.url && (
                <img
                  src={event.media.url}
                  alt={event.text.headline}
                  className={`timeline-event-image ${isHovered ? "timeline-event-image-visible" : ""}`}
                />
              )}
            </div>

            <div className="timeline-event-text">
              {parse(event.text.text)}
            </div>
          </Link>
          <div className="timeline-marker"></div>
          <div className="timeline-year">{year}</div>
        </>
      ) : (
        <>
          <div className="timeline-year">{year}</div>
          <div className="timeline-marker"></div>
          <Link 
            to={`/post/${event.address}`}
            className="timeline-event-content"
          >
            <div className="timeline-event-date">{dateString}</div>
            <h3 className="timeline-event-title">{event.text.headline}</h3>
            
            <div className="timeline-event-image-wrapper">
              {event.media.url && (
                <img
                  src={event.media.url}
                  alt={event.text.headline}
                  className={`timeline-event-image ${isHovered ? "timeline-event-image-visible" : ""}`}
                />
              )}
            </div>

            <div className="timeline-event-text">
              {parse(event.text.text)}
            </div>
          </Link>
        </>
      )}
    </div>
  );
}

export default Timeline;