import React, { useState } from "react";
import { useAdminMenuModule } from "./module";
import SidebarMenu from "@/components/SidebarMenu";
import HamburgerMenu from "@/components/HamburgerMenu";
import Alert from "@/components/Alert/index";

const AdminMenu: React.FC = () => {
  const { menuOptions, alertMessage } = useAdminMenuModule();
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar Menu para telas grandes */}
      <div className="hidden lg:block w-64">
        <SidebarMenu options={menuOptions} />
      </div>

      {/* Hamburger Menu para dispositivos móveis */}
      <div className="lg:hidden">
        <HamburgerMenu
          options={menuOptions}
          onClick={() => setIsMobileMenuVisible(!isMobileMenuVisible)}
        />
        {isMobileMenuVisible && (
          <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] z-10">
            <SidebarMenu options={menuOptions} />
          </div>
        )}
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col items-center justify-start pt-10 p-6 bg-[var(--background)]">
        {/* Alerta */}
        {alertMessage && (
          <div className="mb-6 w-full max-w-2xl mx-auto">
            <Alert type="warning" message={alertMessage} />
          </div>
        )}

        {/* Mensagem de Boas-Vindas */}
        <div className="bg-[var(--secondary)] shadow-lg rounded-lg p-8 w-full max-w-2xl mx-auto border border-[var(--primary)]">
          <h2 className="text-2xl font-bold text-center text-[var(--primary-700)] mb-4">
            Welcome to the Admin Panel!
          </h2>
          <p className="text-lg text-center text-[var(--primary)]">
            Use the menu on the left to navigate through different sections and manage system functionalities. Have a great day!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
