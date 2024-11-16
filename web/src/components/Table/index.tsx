import React from 'react';

interface TableProps {
  headers: string[];
  data: any[];
}

const Table: React.FC<TableProps> = ({ headers, data }) => {
  return (
    <div className="overflow-x-auto max-w-full">
      <table className="min-w-full hidden lg:table bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:text-white">
        <thead>
          <tr className="bg-[#284b62] text-white dark:bg-[#1e2a36]">
            {headers.map((header, index) => (
              <th
                key={index}
                className="py-3 px-4 border-b text-left font-semibold text-sm uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="even:bg-gray-50 hover:bg-[#f1f5f9] transition-colors duration-150 dark:even:bg-gray-700 dark:hover:bg-gray-600"
            >
              {headers.map((header, headerIndex) => (
                <td
                  key={headerIndex}
                  className="py-3 px-4 border-b text-gray-700 text-sm dark:text-white"
                >
                  {item[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile-friendly vertical layout for smaller screens */}
      <div className="block lg:hidden">
        {data.map((item, index) => (
          <div
            key={index}
            className="border-b border-gray-200 p-4 bg-white shadow-sm rounded-lg mb-4 dark:bg-gray-800 dark:border-gray-600"
          >
            {headers.map((header, headerIndex) => (
              <div key={headerIndex} className="flex justify-between py-2 text-gray-700 dark:text-white">
                <span className="font-semibold">{header}:</span>
                <span>{item[header]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
