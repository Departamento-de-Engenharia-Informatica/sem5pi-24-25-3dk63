import React, { useState } from "react";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Popup from "@/components/Popup";
import { FiLogOut } from "react-icons/fi"; // Importando o ícone de logout

const GoogleLogoutWithPopup: React.FC = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

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
    <>
      <button
        onClick={logout}
        className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-700 rounded-full shadow-lg hover:from-red-600 hover:to-red-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-offset-2 transition-transform transform hover:scale-105"
      >
        <FiLogOut size={20} className="animate-pulse" /> {/* Ícone com animação */}
        Logout
      </button>
      <Popup
        isVisible={isPopupVisible}
        setIsVisible={handlePopupClose}
        message={message}
      />
    </>
  );
};

export default GoogleLogoutWithPopup;
