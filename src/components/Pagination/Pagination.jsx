import React from "react";

function Pagination({ totalPages, currentPage, handlePageChange }) {
  const pageNumbers = [];
  const maxPagesToShow = 5; // Максимальное количество отображаемых страниц

  let startPage = Math.max(currentPage - 2, 1); // 2 страницы слева от текущей
  let endPage = Math.min(currentPage + 2, totalPages); // 2 страницы справа от текущей

  // Если всего страниц больше максимума, то корректируем диапазон
  if (totalPages > maxPagesToShow) {
    if (currentPage <= 3) {
      endPage = maxPagesToShow; // Начинаем с первых страниц
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - maxPagesToShow + 1; // Показываем последние страницы
    }
  }

  // Заполняем массив номерами страниц для отображения
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {/* Если текущая страница не первая, показываем кнопку "Первая" */}
      {startPage > 1 && (
        <button onClick={() => handlePageChange(1)} className="page-button">
          Первая
        </button>
      )}

      {/* Отображаем страницы вокруг текущей */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`page-button ${page === currentPage ? "active" : ""}`}
        >
          {page}
        </button>
      ))}

      {/* Если текущая страница не последняя, показываем кнопку "Последняя" */}
      {endPage < totalPages && (
        <button onClick={() => handlePageChange(totalPages)} className="page-button">
          Последняя
        </button>
      )}
    </div>
  );
}

export default Pagination;
