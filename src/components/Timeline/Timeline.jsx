import { useEffect, useRef } from "react";
import "./Timeline.css";

function Timeline({ data }) {
  const timelineRef = useRef(null);
  const timelineInstance = useRef(null);

  useEffect(() => {
    if (window.TL && timelineRef.current) {
      if (timelineInstance.current) {
        timelineInstance.current.remove(); // Удаляем предыдущий таймлайн перед созданием нового
      }

      // Инициализация TimelineJS с русским языком
      timelineInstance.current = new window.TL.Timeline(timelineRef.current, data, {
        lang: "ru", // Устанавливаем русский язык
        scale_factor: 0.5,
      });

      // Очистка при размонтировании компонента
      return () => {
        if (timelineInstance.current) {
          timelineInstance.current.remove();
        }
      };
    }
  }, [data]);

  return <div className="timeline-container" ref={timelineRef}></div>;
}

export default Timeline;