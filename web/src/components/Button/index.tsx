import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "confirm" | "default" | "destroy" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  name: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = "default",
  onClick,
  name,
  disabled,
  className,
}) => {
  // Definindo as classes de fundo e hover com base nas variáveis do CSS
  const themeColors = {
    confirm: "bg-accent hover:bg-accent-light disabled:hover:bg-accent dark:bg-accent dark:hover:bg-accent-light dark:disabled:hover:bg-accent",
    default: "bg-primary hover:bg-primary-light disabled:hover:bg-primary dark:bg-primary dark:hover:bg-primary-light dark:disabled:hover:bg-primary",
    destroy: "bg-red-500 hover:bg-red-600 disabled:hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 dark:disabled:hover:bg-red-700",
    reset: "bg-gray-500 hover:bg-gray-600 disabled:hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:hover:bg-gray-700",
  };

  return (
    <button
      name={name}
      className={`${themeColors[type]} rounded-lg px-6 py-2 font-poppins text-lg font-semibold text-white focus:outline-none
      disabled:cursor-not-allowed disabled:opacity-50 transform transition duration-200 ease-in-out hover:scale-105 hover:shadow-md
       ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
