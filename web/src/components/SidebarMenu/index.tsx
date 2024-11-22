import React, { useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import GoogleLogoutWithPopup from "@/components/GoogleLogoutWithPopup";
import logoImage from "@/assets/image.png";

interface SidebarMenuProps {
  options: {
    label: string;
    path?: string;
    action?: () => void;
    icon?: React.ReactNode;
  }[];
  title: string;
  basePath?: string; // e.g., '/admin' for admin pages
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ options, title, basePath = '/admin' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = useMemo(
    () =>
      options.map((option, index) => (
        <li key={index}>
          {option.path ? (
            <NavLink
              to={option.path}
              className={({ isActive }) =>
                `flex items-center space-x-6 px-6 py-3 rounded-md text-lg font-semibold
                transition-all duration-300 ease-in-out transform
                ${
                  isActive
                    ? "bg-[var(--accent)] text-white scale-105 cursor-default pointer-events-none shadow-lg"
                    : "hover:bg-[var(--accent)] hover:text-white hover:scale-105 hover:shadow-xl"
                }`
              }
            >
              {option.icon && <span className="w-7 h-7">{option.icon}</span>}
              <span className="ml-2">{option.label}</span>
            </NavLink>
          ) : (
            <button
              onClick={() => option.action && option.action()}
              className="flex items-center space-x-6 w-full px-6 py-3 rounded-md text-lg font-semibold
                       transition-all duration-300 ease-in-out transform
                       hover:scale-105 hover:bg-[var(--accent)] hover:text-white"
            >
              {option.icon && <span className="w-7 h-7">{option.icon}</span>}
              <span className="ml-2">{option.label}</span>
            </button>
          )}
        </li>
      )),
    [options, location.pathname]
  );

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-primary to-secondary text-white shadow-xl z-10 flex flex-col justify-between">
      {/* Logo Section - Now clickable */}
      <div
        onClick={() => navigate(basePath)}
        className="py-4 px-6 flex flex-col items-center cursor-pointer group"
      >
        <img
          src={logoImage}
          alt="Logo"
          className="w-20 h-auto mb-4 rounded-full shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
        />
        <p className="text-xl font-semibold text-white tracking-wide uppercase mt-2 transform transition-all duration-300 group-hover:text-primary-500">
          CliniTech
        </p>
      </div>

      {/* Linha separadora mais próxima do topo */}
      <div className="border-t-2 border-white -my-40"></div>

      {/* Sidebar - Panel */}
      <div className="py-2 px-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center tracking-widest uppercase">
          {title}
        </h2>
        <ul className="space-y-6">{menuItems}</ul>
      </div>

      {/* Logout Section */}
      <div className="py-4 px-6 flex justify-center items-center">
        <GoogleLogoutWithPopup />
      </div>
    </div>
  );
};

export default SidebarMenu;