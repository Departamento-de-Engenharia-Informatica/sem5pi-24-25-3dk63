import React from "react";

const DetailsTable = ({ headers, data }: { headers: string[]; data: string[][] }) => (
  <table className="min-w-full border-collapse border border-gray-300">
    <thead>
      <tr>
        {headers.map((header) => (
          <th key={header} className="border border-gray-300 px-4 py-2 text-left">
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index} className="even:bg-gray-100">
          {row.map((cell, cellIndex) => (
            <td key={cellIndex} className="border border-gray-300 px-4 py-2">
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
