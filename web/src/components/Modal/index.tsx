import { useEffect } from "react";
import { motion } from "framer-motion";

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
}) => {
  useEffect(() => {
    const closeWithEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsVisible(false);
    };
    window.addEventListener("keydown", closeWithEsc);

    return () => window.removeEventListener("keydown", closeWithEsc);
  }, [setIsVisible]);

  if (isVisible)
    return (
      <>
        <section
          aria-label="modal-overlay"
          onClick={() => setIsVisible(false)}
          className="fixed left-0 top-0 h-screen w-screen bg-gray-800 opacity-50" // Fundo escurecido
        ></section>
        <div className="fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center">
          <motion.div
            initial={{ bottom: 0, opacity: 0 }}
            animate={{ bottom: 150, opacity: 1 }}
            transition={{ duration: 0.3 }} // Transição um pouco mais longa
            className={`flex w-full max-w-lg flex-col rounded-2xl bg-white p-8 shadow-2xl ${className}`} // Alterando o fundo e sombra
          >
            <button
              onClick={() => setIsVisible(false)}
              className="self-end text-2xl font-bold text-red-500 hover:text-red-600"
            >
              &times; {/* Usando símbolo 'X' */}
            </button>
            <span className="mb-4 w-full text-center text-3xl font-bold capitalize text-[#284b62]"> {/* Mudando a cor do título */}
              {title}
            </span>
            <div className="max-h-[75vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      </>
    );
};

export default Modal;
