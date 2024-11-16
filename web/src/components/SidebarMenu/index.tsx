import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarMenuProps {
  options: { label: string; path?: string; action?: () => void; icon?: React.ReactNode }[]; 
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ options }) => {
  const handleItemClick = (action?: () => void) => {
    if (action) {
      action();
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-[var(--primary)] text-white shadow-xl z-10">
      <div className="py-6 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Admin Menu</h2>
        <ul className="space-y-4">
          {options.map((option, index) => (
            <li key={index}>
              {option.path ? (
                <NavLink
                  to={option.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 px-4 py-2 rounded-md text-lg font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${
                      isActive
                        ? "bg-[var(--accent)] text-white shadow-xl"
                        : "hover:bg-[var(--accent)] hover:text-white hover:shadow-2xl"
                    }`
                  }
                >
                  {option.icon && <span className="w-6 h-6">{option.icon}</span>}
                  <span>{option.label}</span>
                </NavLink>
              ) : (
                <button
                  onClick={() => handleItemClick(option.action)}
                  className="flex items-center space-x-4 block w-full px-4 py-2 rounded-md text-lg font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[var(--accent)] hover:text-white hover:shadow-2xl text-left"
                >
                  {option.icon && <span className="w-6 h-6">{option.icon}</span>}
                  <span>{option.label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarMenu;
