// HamburgerMenu.tsx
import React from "react";

interface HamburgerMenuProps {
  options: { label: string; action: () => void }[];
  onClick: () => void;
}


const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ options }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-0 left-0 m-2">
      <button
        onClick={toggleMenu}
        className="p-4 rounded-md focus:outline-none bg-[#ffffff] text-[#284b62]"
      >
        <div className="space-y-1">
          <span className="block w-6 h-0.5 bg-[#284b62]"></span>
          <span className="block w-6 h-0.5 bg-[#284b62]"></span>
          <span className="block w-6 h-0.5 bg-[#284b62]"></span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-[#284b62] hover:text-white rounded-md transition-colors duration-150"
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
