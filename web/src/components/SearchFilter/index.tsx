import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface SearchFilterProps {
  attributes: string[];
  labels: Record<string, string>;
  onSearch: (query: Record<string, string>) => void;
  results: any[];
  renderResult: (result: any) => JSX.Element;
  fieldTypes?: Record<string, 'text' | 'select' | 'date'>;
  selectOptions?: Record<string, { label: string, value: string }[]>;
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
            className="relative border rounded-md shadow-sm p-2 w-full sm:w-auto flex-1 dark:bg-gray-700 dark:border-gray-600"
          >
            <div
              className="flex justify-between items-center cursor-pointer text-text dark:text-text-light"
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
                  className="mt-2 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                >
                  <option value="" disabled>Select</option>
                  {selectOptions[attribute].map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : fieldTypes[attribute] === 'date' ? (
                <input
                  type="date"
                  value={query[attribute] || ''}
                  onChange={e => handleChange(attribute, e.target.value)}
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                />
              ) : (
                <input
                  type="text"
                  value={query[attribute] || ''}
                  className="mt-2 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                  onChange={e => handleChange(attribute, e.target.value)}
                />
              )
            )}
          </div>
        ))}
        <div className="flex space-x-2 mt-4 lg:mt-0 ml-auto">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
          >
            Reset
          </button>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark dark:bg-blue-700 dark:hover:bg-blue-600"
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
