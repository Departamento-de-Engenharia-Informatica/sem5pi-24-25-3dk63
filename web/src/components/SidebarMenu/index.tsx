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
    <div className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-primary to-secondary text-white shadow-xl z-10">
      <div className="py-8 px-6">
        <h2 className="text-3xl font-bold mb-12 text-center tracking-widest uppercase">Admin Panel</h2>
        <ul className="space-y-6">
          {options.map((option, index) => (
            <li key={index}>
              {option.path ? (
                <NavLink
                  to={option.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-6 px-6 py-3 rounded-md text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[var(--accent)] hover:text-white ${
                      isActive
                        ? "bg-primary-500 text-white shadow-lg scale-105"
                        : "hover:bg-primary-600 hover:shadow-xl"
                    }`
                  }
                >
                  {option.icon && <span className="w-7 h-7">{option.icon}</span>}
                  <span className="ml-2">{option.label}</span>
                </NavLink>
              ) : (
                <button
                  onClick={() => handleItemClick(option.action)}
                  className="flex items-center space-x-6 block w-full px-6 py-3 rounded-md text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[var(--accent)] hover:text-white"
                >
                  {option.icon && <span className="w-7 h-7">{option.icon}</span>}
                  <span className="ml-2">{option.label}</span>
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
