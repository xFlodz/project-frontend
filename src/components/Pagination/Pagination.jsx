import React from "react";

function Pagination({ totalPages, currentPage, handlePageChange }) {
  const pageNumbers = [];
  const maxPagesToShow = 5;

  let startPage = Math.max(currentPage - 2, 1);
  let endPage = Math.min(currentPage + 2, totalPages);

  if (totalPages > maxPagesToShow) {
    if (currentPage <= 3) {
      endPage = maxPagesToShow;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - maxPagesToShow + 1;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {startPage > 1 && (
        <button onClick={() => handlePageChange(1)} className="page-button">
          Первая
        </button>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`page-button ${page === currentPage ? "active" : ""}`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <button onClick={() => handlePageChange(totalPages)} className="page-button">
          Последняя
        </button>
      )}
    </div>
  );
}

export default Pagination;
