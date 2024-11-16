interface ThemeToggleButtonProps {
  theme: string;
  toggleTheme: () => void;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="absolute top-4 right-4 p-2 text-white bg-[#284b62] rounded-full"
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default ThemeToggleButton;
