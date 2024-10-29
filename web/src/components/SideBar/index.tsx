import { createElement, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { sanitizeRole } from "@/utils/sanitizeRole";

import AuthContext from "../../context/AuthContext";

interface SideBarProps {
  menuOptions: {
    label: string;
    icon: string;
    onClick: () => void;
  }[];
}
const SideBar: React.FC<SideBarProps> = ({ menuOptions }) => {
  const { role, username } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!role) return <></>;

  const sanitizedRole = sanitizeRole(role);

  return (
    <nav className="grid min-h-screen w-1/4 max-w-sm grid-rows-[1fr_4fr_1fr] bg-primary pt-12">
      <img
        src="/assets/logos/light-reverse/png/logo-no-background.png"
        alt="Logo"
        className="mx-auto w-3/4"
      />

      <ul className="flex flex-col md:text-xl lg:text-2xl">
        {menuOptions.map((option) => (
          <button
            onClick={option.onClick}
            key={option.label}
            name={option.label.toLowerCase()}
            className={`ml-12 flex h-16 items-center gap-x-4 text-left text-white hover:text-secondary`}
          >
            {createElement(option.icon)}
            {option.label}
          </button>
        ))}
      </ul>

      <button
        className="ml-12 flex items-center justify-start gap-x-4"
        onClick={() => navigate("/profile")}
      >
        <img
          src="/assets/avatar.jpg"
          alt="Avatar"
          className="aspect-square h-1/3 max-h-[64px] max-w-[64px] rounded-full"
        />
        <div className="flex flex-col items-start">
          <h1 className="mb-2 text-start text-base font-bold leading-none text-white lg:text-xl">
            {username}
          </h1>
          <p className="text-start text-sm leading-none text-white">
            {sanitizedRole}
          </p>
        </div>
      </button>
    </nav>
  );
};

export default SideBar;
