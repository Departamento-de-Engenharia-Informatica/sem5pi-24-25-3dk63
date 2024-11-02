import React, { useState } from 'react';

interface SearchFilterProps {
  attributes: string[];
  labels: Record<string, string>; 
  onSearch: (query: Record<string, string>) => void;
  results: any[];
  renderResult: (result: any) => JSX.Element;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ attributes, labels, onSearch, results, renderResult }) => {
  const [query, setQuery] = useState<Record<string, string>>({});

  const handleChange = (attribute: string, value: string) => {
    setQuery(prev => ({ ...prev, [attribute]: value }));
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        {attributes.map(attribute => (
          <div key={attribute} className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {labels[attribute] || attribute}
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={e => handleChange(attribute, e.target.value)}
            />
          </div>
        ))}
        <button
          onClick={handleSearch}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>
      <div>
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
