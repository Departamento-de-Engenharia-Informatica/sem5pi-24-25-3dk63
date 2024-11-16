import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from '@/components/Button';

interface DropdownOption {
  label: string;
  onClick: () => void;
  className?: string;
}

interface DropdownMenuProps {
  options: DropdownOption[];
  buttonLabel: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ options, buttonLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

  const toggleDropdown = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      const rect = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    } else {
      setDropdownPosition(null);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownPosition && dropdownPosition.top !== null && dropdownPosition.left !== null) {
        const dropdownElement = document.getElementById('dropdown-menu');
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setIsOpen(false);
          setDropdownPosition(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownPosition]);

  return (
    <div className="relative inline-block text-left">
      <Button
        onClick={toggleDropdown}
        name="actions"
        className="px-4 py-2 text-white bg-[#284b62] hover:bg-[#3a617d] dark:bg-[#2d3b47] dark:hover:bg-[#3a4a58] rounded-md"
      >
        {buttonLabel}
      </Button>
      {isOpen && dropdownPosition && (
        ReactDOM.createPortal(
          <div
            id="dropdown-menu"
            className="absolute z-50 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-opacity-10 focus:outline-none transform transition ease-out duration-200"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            <div className="py-1">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    option.onClick();
                    setIsOpen(false);
                    setDropdownPosition(null);
                  }}
                  className={`w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-[#f1f5f9] dark:hover:bg-[#3a4a58] hover:text-[#284b62] dark:hover:text-white ${option.className}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )
      )}
    </div>
  );
};

export default DropdownMenu;
