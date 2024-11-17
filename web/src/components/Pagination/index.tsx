// Pagination.tsx

import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';  // Importando os ícones

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-3 mt-8 mb-6">
      {/* Botão "Previous" com ícone */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-600 disabled:opacity-50 transition-colors duration-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:opacity-40"
      >
        <FaChevronLeft /> {/* Ícone de seta esquerda */}
      </button>

      {/* Botões de Página */}
      <div className="flex gap-2">
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentPage === page
                ? 'bg-primary text-white dark:bg-primary dark:text-white'
                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Botão "Next" com ícone */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-600 disabled:opacity-50 transition-colors duration-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:opacity-40"
      >
        <FaChevronRight /> {/* Ícone de seta direita */}
      </button>
    </div>
  );
};

export default Pagination;
