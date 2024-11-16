import React from "react";

interface HamburgerMenuProps {
  options: { label: string; action: () => void }[];
  onClick: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ options, onClick }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-0 left-0 m-2">
      <button
        onClick={toggleMenu}
        className="p-4 rounded-md focus:outline-none bg-white text-[#284b62] dark:bg-gray-800 dark:text-white"
      >
        <div className="space-y-1">
          <span className="block w-6 h-0.5 bg-[#284b62] dark:bg-white"></span>
          <span className="block w-6 h-0.5 bg-[#284b62] dark:bg-white"></span>
          <span className="block w-6 h-0.5 bg-[#284b62] dark:bg-white"></span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-[#284b62] dark:hover:bg-[#3a4a58] hover:text-white dark:hover:text-white rounded-md transition-colors duration-150"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
