import React from "react";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Popup from "@/components/Popup";
import { FiLogOut } from "react-icons/fi";

interface HamburgerMenuProps {
  options: { label: string; action: () => void }[];
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ options }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPopupVisible, setIsPopupVisible] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    googleLogout();
    setMessage("Logout successful");
    setIsPopupVisible(true);
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
    setMessage(null);
    navigate("/");
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

          {/* Botão de Logout Adicionado no Menu */}
          <button
            onClick={logout}
            className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-red-600 dark:hover:bg-red-700 hover:text-white dark:hover:text-white rounded-md transition-colors duration-150 mt-2"
          >
            <div className="flex items-center gap-2 justify-center">
              <FiLogOut size={20} />
              <span>Logout</span>
            </div>
          </button>
        </div>
      )}

      <Popup
        isVisible={isPopupVisible}
        setIsVisible={handlePopupClose}
        message={message}
      />
    </div>
  );
};

export default HamburgerMenu;
