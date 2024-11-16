import React from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded bg-primary hover:bg-primary-600 disabled:opacity-50 text-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:opacity-40"
      >
        Previous
      </button>
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded ${
            currentPage === page
              ? 'bg-primary text-white dark:bg-primary dark:text-white'
              : 'bg-gray-200 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-100'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded bg-primary hover:bg-primary-600 disabled:opacity-50 text-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:opacity-40 dark:text-white"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
