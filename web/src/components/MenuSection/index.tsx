import React from "react";
import { IconType } from "react-icons";  // Para tipar os ícones passados como props

interface MenuSectionProps {
  title: string;
  description?: string;
  Icon?: IconType;  // Tipo para ícones (opcional)
  iconColorClass: string;
  backgroundClass: string;
  isWelcomeMessage?: boolean;  // Propriedade opcional para exibir a mensagem de boas-vindas
}

const MenuSection: React.FC<MenuSectionProps> = ({
  title,
  description,
  Icon,
  iconColorClass,
  backgroundClass,
  isWelcomeMessage = false,  // Se for true, será uma mensagem de boas-vindas
}) => {
  return (
    <div className={`p-6 rounded-lg shadow-xl ${backgroundClass} overflow-y-auto max-h-screen`}>
      {isWelcomeMessage ? (
        <div className="bg-white dark:bg-[#2d2f3f] shadow-lg rounded-lg p-8 mx-auto w-full max-w-4xl border border-[#e5e7eb] dark:border-[#374151] h-full flex flex-col items-center justify-center">
          <h2 className="text-3xl font-semibold text-center text-[#1f2937] dark:text-white mb-4 flex items-center justify-center">
            {Icon && <Icon className="mr-2 text-3xl text-[#1f2937] dark:text-white" />}
            {title}
          </h2>
          <p className="text-lg text-center text-[#4b5563] dark:text-gray-300 mb-8">
            {description}
          </p>
        </div>
      ) : (
        <>
          {Icon && (
            <Icon className={`text-5xl ${iconColorClass} mb-6 mx-auto`} />
          )}
          <h3 className="text-2xl font-semibold text-center text-[#1f2937] dark:text-white mb-4">{title}</h3>
          <p className="text-center text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </>
      )}
    </div>
  );
};

export default MenuSection;
