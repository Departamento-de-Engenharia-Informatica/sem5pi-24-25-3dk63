import React from "react";
import { motion } from "framer-motion";
import Button from "../Button";

interface PopupProps {
  isVisible: boolean;
  setIsVisible: () => void;
  message: string | null;
}

const Popup: React.FC<PopupProps> = ({ isVisible, setIsVisible, message }) => {
  if (!isVisible || !message) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-gray-800 opacity-50"
        onClick={setIsVisible}
      />
      <motion.div
        className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-center text-lg mb-4">{message}</p>
        <div className="flex justify-center">
          <Button onClick={setIsVisible} name="ok-button">
            OK
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Popup;