import React from "react";
import { motion } from "framer-motion";
import Button from "../Button";

interface ConfirmationProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const Confirmation: React.FC<ConfirmationProps> = ({
  isVisible,
  onConfirm,
  onCancel,
  message,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-gray-800 opacity-50 dark:bg-black dark:opacity-60"
        onClick={onCancel}
      />
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-lg z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-center text-lg mb-4 text-gray-800 dark:text-gray-200">{message}</p>
        <div className="flex justify-center space-x-4">
          <Button onClick={onConfirm} name="confirm-button">
            Confirm
          </Button>
          <Button onClick={onCancel} name="cancel-button">
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Confirmation;
