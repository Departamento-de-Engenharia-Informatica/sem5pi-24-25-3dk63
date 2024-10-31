import React from 'react';

interface TableProps {
  headers: string[];
  data: any[];
}

const Table: React.FC<TableProps> = ({ headers, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full hidden lg:table bg-white">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="py-2 px-4 border-b text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              {headers.map((header, headerIndex) => (
                <td key={headerIndex} className="py-2 px-4 border-b">{item[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Versão Vertical para telas menores */}
      <div className="block lg:hidden">
        {data.map((item, index) => (
          <div key={index} className="border-b border-gray-200 p-4">
            {headers.map((header, headerIndex) => (
              <div key={headerIndex} className="flex justify-between py-1">
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
