import React, { useEffect } from 'react';

function Pagination({ currentPage, setCurrentPage, cardList, cardsPerPage }) {
  const totalPages = Math.ceil(cardList.length / cardsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 500);
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const delta = 1; // Number of page numbers to show around the current page

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    // Always show the first page number
    pageNumbers.push(
      <li key={1} className={` ${currentPage === 1 ? 'text-blue-500 bg-blue-50 ' : ''}`}>
        <p
          className="text-lg cursor-pointer font-semibold px-3 py-1"
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
        >
          1
        </p>
      </li>
    );

    // Show ellipsis if there are more pages on the left
    if (left > 2) {
      pageNumbers.push(
        <li key="ellipsis-left" className="text-xl font-semibold px-1 py-1">
          ...
        </li>
      );
    }

    // Show middle page numbers
    for (let i = left; i <= right; i++) {
      pageNumbers.push(
        <li key={i} className={` ${currentPage === i ? 'text-blue-500 bg-blue-50 ' : ''}`}>
          <p
            className="text-xl cursor-pointer font-semibold px-3 py-1"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(i);
            }}
          >
            {i}
          </p>
        </li>
      );
    }

    // Show ellipsis if there are more pages on the right
    if (right < totalPages - 1) {
      pageNumbers.push(
        <li key="ellipsis-right" className="text-xl font-semibold px-1 py-1">
          ...
        </li>
      );
    }

    // Always show the last page number
    if (totalPages > 1) {
      pageNumbers.push(
        <li key={totalPages} className={` ${currentPage === totalPages ? 'text-blue-500 bg-blue-50 ' : ''}`}>
          <p
            className="text-xl cursor-pointer font-semibold px-4 py-1"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(totalPages);
            }}
          >
            {totalPages}
          </p>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center mt-10">
      <ul className="pagination flex border rounded-md items-center">
        <svg
          className={`px-2 py-1 min-w-10 h-full border-r ${currentPage <= 1 ? 'text-gray-300' : ''}`}
          onClick={handlePrevPage}
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <polyline points="15 6 9 12 15 18" />
        </svg>
        {renderPageNumbers()}
        <svg
          className={`px-2 py-1 min-w-10 h-full border-l ${currentPage == totalPages ? 'text-gray-300' : ''}`}
          onClick={handleNextPage}
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </ul>
    </div>
  );
}

export default Pagination;
