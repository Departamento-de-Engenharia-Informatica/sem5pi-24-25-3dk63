import { FC } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

interface ThemeToggleButtonProps {
  theme: string;
  toggleTheme: () => void;
}

const ThemeToggleButton: FC<ThemeToggleButtonProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-primary text-text rounded-full shadow-md hover:bg-accent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <SunIcon className="w-6 h-6" />
      ) : (
        <MoonIcon className="w-6 h-6" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
