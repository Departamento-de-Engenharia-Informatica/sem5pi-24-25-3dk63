import { useEffect } from "react";
import { motion } from "framer-motion";
import React from "react";

interface ModalProps {
  isVisible?: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  children?: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  setIsVisible,
  title,
  children,
  className,
  onClose,
}) => {
  useEffect(() => {
    const closeWithEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVisible(false);
        if (onClose) onClose();
      }
    };
    window.addEventListener("keydown", closeWithEsc);

    return () => window.removeEventListener("keydown", closeWithEsc);
  }, [setIsVisible, onClose]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <>
      <section
        aria-label="modal-overlay"
        onClick={handleClose}
        className="fixed left-0 top-0 h-screen w-screen bg-gray-800 opacity-50 dark:bg-gray-900"
      ></section>
      <div className="fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center">
        <motion.div
          initial={{ bottom: 0, opacity: 0 }}
          animate={{ bottom: 150, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`flex w-full max-w-lg flex-col rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800 ${className}`}
          role="dialog" //
        >
          <button
            onClick={handleClose}
            className="self-end text-2xl font-bold text-red-500 hover:text-red-600"
            aria-label="Close Modal"
          >
            &times;
          </button>
          <span className="mb-4 w-full text-center text-3xl font-bold capitalize text-[#284b62] dark:text-white"> {/* Mudando a cor do título para o modo escuro */}
            {title}
          </span>
          <div className="max-h-[75vh] overflow-y-auto text-black dark:text-black-300">
            {children}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Modal;
