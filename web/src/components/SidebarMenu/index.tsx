import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarMenuProps {
  options: { label: string; path?: string; action?: () => void }[]; // O path é opcional, pois agora podemos ter uma action.
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ options }) => {
  const handleItemClick = (action?: () => void) => {
    if (action) {
      action(); // Executa a ação associada ao item
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-[var(--primary)] text-white shadow-lg">
      <div className="py-6 px-4">
        <h2 className="text-xl font-bold mb-6 text-center">Admin Menu</h2>
        <ul className="space-y-4">
          {options.map((option, index) => (
            <li key={index}>
              {/* Verifica se há um 'path', caso contrário, chama a 'action' */}
              {option.path ? (
                <NavLink
                  to={option.path}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md text-lg font-medium ${
                      isActive
                        ? "bg-[var(--accent)] text-white"
                        : "hover:bg-[var(--primary-500)]"
                    }`
                  }
                >
                  {option.label}
                </NavLink>
              ) : (
                <button
                  onClick={() => handleItemClick(option.action)}
                  className="block w-full px-4 py-2 rounded-md text-lg font-medium hover:bg-[var(--primary-500)] text-left"
                >
                  {option.label}
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
