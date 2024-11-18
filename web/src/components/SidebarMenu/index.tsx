import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import GoogleLogoutWithPopup from "@/components/GoogleLogoutWithPopup";
import logoImage from "@/assets/image.png";  // Importando a imagem do logo

interface SidebarMenuProps {
  options: { label: string; path?: string; action?: () => void; icon?: React.ReactNode }[];
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ options }) => {
  const menuItems = useMemo(
    () =>
      options.map((option, index) => (
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
              onClick={() => option.action && option.action()}
              className="flex items-center space-x-6 w-full px-6 py-3 rounded-md text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[var(--accent)] hover:text-white"
            >
              {option.icon && <span className="w-7 h-7">{option.icon}</span>}
              <span className="ml-2">{option.label}</span>
            </button>
          )}
        </li>
      )),
    [options]
  );

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-primary to-secondary text-white shadow-xl z-10 flex flex-col justify-between">
      {/* Logo Section */}
      <div className="py-4 px-6 flex flex-col items-center">
        <img
          src={logoImage}
          alt="Logo"
          className="w-20 h-auto mb-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
        />
        <p className="text-xl font-semibold text-white tracking-wide uppercase mt-2 transform transition-all duration-300 hover:text-primary-500">
          CliniTech
        </p>
      </div>

      {/* Linha separadora mais próxima do topo */}
      <div className="border-t-2 border-white -my-40"></div> {/* Linha separadora com menor margem superior */}

      {/* Sidebar - Admin Panel */}
      <div className="py-2 px-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center tracking-widest uppercase">Admin Panel</h2> {/* Título mais próximo do topo */}
        <ul className="space-y-6">{menuItems}</ul>
      </div>

      {/* Logout Section, agora centralizado na parte inferior */}
      <div className="py-4 px-6 flex justify-center items-center">
        <GoogleLogoutWithPopup />
      </div>
    </div>
  );
};

export default SidebarMenu;
