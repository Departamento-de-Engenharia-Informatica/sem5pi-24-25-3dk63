import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface SearchFilterProps {
  attributes: string[];
  labels: Record<string, string>;
  onSearch: (query: Record<string, string>) => void;
  results: any[];
  renderResult: (result: any) => JSX.Element;
  fieldTypes?: Record<string, 'text' | 'select' | 'date'>;
  selectOptions?: Record<string, string[]>;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  attributes,
  labels,
  onSearch,
  results,
  renderResult,
  fieldTypes = {},
  selectOptions = {}
}) => {
  const [query, setQuery] = useState<Record<string, string>>({});
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({});

  const handleChange = (attribute: string, value: string) => {
    setQuery(prev => ({ ...prev, [attribute]: value }));
  };

  const handleSearch = () => {
    onSearch(query);
  };

  const handleReset = () => {
    const resetQuery = Object.fromEntries(attributes.map(attr => [attr, '']));
    setQuery(resetQuery);
    onSearch(resetQuery);
  };

  const toggleField = (attribute: string) => {
    setExpandedFields(prev => ({ ...prev, [attribute]: !prev[attribute] }));
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-start space-y-4 lg:space-y-0 lg:space-x-4">
        {attributes.map(attribute => (
          <div
            key={attribute}
            className="relative border rounded-md shadow-sm p-2 bg-white w-full sm:w-auto flex-1"
            style={{ backgroundColor: "#f8f9fa", borderColor: "#cbd5e0", minWidth: "150px" }}
          >
            <div
              className="flex justify-between items-center cursor-pointer text-gray-800"
              onClick={() => toggleField(attribute)}
            >
              <label className="text-sm font-medium">
                {labels[attribute] || attribute}
              </label>
              {expandedFields[attribute] ? <FaChevronUp color="#4a5568" /> : <FaChevronDown color="#4a5568" />}
            </div>
            {expandedFields[attribute] && (
              fieldTypes[attribute] === 'select' && selectOptions[attribute] ? (
                <select
                  value={query[attribute] || ''}
                  onChange={e => handleChange(attribute, e.target.value)}
                  className="mt-2 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e0", color: "#2d3748" }}
                >
                  <option value="" disabled>Select</option>
                  {selectOptions[attribute].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : fieldTypes[attribute] === 'date' ? (
                <input
                  type="date"
                  value={query[attribute] || ''}
                  onChange={e => handleChange(attribute, e.target.value)}
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500 sm:text-sm"
                />
              ) : (
                <input
                  type="text"
                  value={query[attribute] || ''}
                  className="mt-2 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e0", color: "#2d3748" }}
                  onChange={e => handleChange(attribute, e.target.value)}
                />
              )
            )}
          </div>
        ))}
        <div className="flex space-x-2 mt-4 lg:mt-0 ml-auto">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Reset
          </button>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#284b62] text-white rounded-md hover:bg-[#3a617d]"
          >
            Search
          </button>
        </div>
      </div>
      <div className="mt-4">
        {results.map(result => (
          <div key={result.id} className="mb-2">
            {renderResult(result)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;
