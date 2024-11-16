import React from 'react';

const backgrounds = {
  confirm: "bg-green-500 hover:bg-green-600 disabled:hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600 dark:disabled:hover:bg-green-700",
  default: "bg-[#284b62] hover:bg-[#3a617d] disabled:hover:bg-[#284b62] dark:bg-[#1e3545] dark:hover:bg-[#284b62] dark:disabled:hover:bg-[#1e3545]",
  destroy: "bg-red-500 hover:bg-red-600 disabled:hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 dark:disabled:hover:bg-red-700",
  reset: "bg-gray-500 hover:bg-gray-600 disabled:hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:hover:bg-gray-700",
};

interface ButtonProps {
  children: React.ReactNode;
  type?: keyof typeof backgrounds;
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
  return (
    <button
      name={name}
      className={`${backgrounds[type]} rounded-lg px-6 py-2 font-poppins text-lg font-semibold text-white focus:outline-none
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
