// Table.tsx

import React from 'react';
import Pagination from '@/components/Pagination';

interface CardProps {
  headers: string[];
  data: any[];
}

interface TableProps {
  headers: string[];
  data: any[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Card: React.FC<{ patient: any; headers: string[] }> = ({ patient, headers }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 mb-6 bg-gray-50 dark:bg-gray-800 shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-xl max-w-[350px] w-full mx-auto">
    {headers.map((header, index) => {
      const value = patient[header];
      return (
        <div key={index} className="mb-4">
          <div className="font-bold text-gray-700 dark:text-gray-300 text-sm mb-2">{header}:</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm ml-2">{value ? value : '-'}</div>
        </div>
      );
    })}
    <div className="flex justify-end mt-4">
      {patient.actions || 'Actions'}
    </div>
  </div>
);

const Table: React.FC<TableProps> = ({ headers, data, totalPages, currentPage, onPageChange }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Paginação no topo */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />

      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto max-w-screen-xl">
        {data.map((patient, index) => (
          <Card key={index} patient={patient} headers={headers} />
        ))}
      </div>
    </div>
  );
};

export default Table;
