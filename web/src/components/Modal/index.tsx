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
          onClick={() => setIsVisible((cur) => !cur)}
          className="fixed left-0 top-0 h-screen w-screen bg-slate-300 p-6 opacity-70 shadow-lg"
        ></section>
        <div className="fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center">
          <motion.div
            initial={{ bottom: 0, opacity: 0 }}
            animate={{ bottom: 150, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`flex h-fit w-4/5 flex-col rounded-xl bg-slate-300 p-8 ${className} `}
          >
            <button
              onClick={() => setIsVisible(false)}
              className="z-40 self-end text-2xl font-black text-red-500 hover:text-red-600"
            >
              X
            </button>
            <span className="-mt-9 mb-6 w-full text-center text-4xl font-black capitalize">
              {title}
            </span>
            <div className="max-h-[75vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      </>
    );
};

export default Modal;
