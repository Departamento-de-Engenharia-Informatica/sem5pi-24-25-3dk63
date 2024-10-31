// HamburgerMenu.tsx
import React from "react";

interface HamburgerMenuProps {
  options: { label: string; action: () => void }[];
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ options }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-0 left-0 m-1"> 
      <button
        onClick={toggleMenu}
        className="p-2 rounded focus:outline-none"
        style={{ color: "var(--primary)" }}
      >
        {/* Hamburger Icon */}
        <div className="space-y-1">
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className="block w-full px-4 py-2 text-left hover:bg-primary-500 hover:text-white"
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
