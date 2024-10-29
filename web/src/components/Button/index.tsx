const backgrounds = {
  confirm: "bg-green-500 hover:bg-green-700 disabled:hover:bg-green-500",
  default: "bg-primary hover:bg-primary-500 disabled:hover:bg-primary",
  destroy: "bg-red-500 hover:bg-red-700 disabled:hover:bg-red-500",
  reset: "bg-gray-500 hover:bg-gray-700 disabled:hover:bg-gray-500",
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
      className={`${backgrounds[type]} rounded px-6 py-2 font-poppins text-lg font-bold text-white focus:outline-none
      disabled:cursor-not-allowed disabled:opacity-50
       ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
