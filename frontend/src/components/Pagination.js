import React from 'react';
import './Pagination.css';

const Pagination = ({ page = 1, pages = 1, onPageChange }) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(pages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        className="pagination-btn"
      >
        First
      </button>

      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="pagination-btn"
      >
        Previous
      </button>

      {renderPageNumbers().map((pgNumber) => (
        <button
          key={pgNumber}
          onClick={() => onPageChange(pgNumber)}
          className={`pagination-btn ${page === pgNumber ? 'active' : ''}`}
        >
          {pgNumber}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="pagination-btn"
      >
        Next
      </button>

      <button
        onClick={() => onPageChange(pages)}
        disabled={page === pages}
        className="pagination-btn"
      >
        Last
      </button>

      <span className="pagination-info">
        Page {page} of {pages}
      </span>
    </div>
  );
};

export default Pagination;
