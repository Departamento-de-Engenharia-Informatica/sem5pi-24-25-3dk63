import React, { useState } from "react";
import { useAdminMenuModule } from "./module";
import SidebarMenu from "@/components/SidebarMenu";
import HamburgerMenu from "@/components/HamburgerMenu";
import Alert from "@/components/Alert/index";
import { FaUserAlt, FaUsersCog, FaProcedures } from "react-icons/fa";  // Usando react-icons
import MenuSection from "@/components/MenuSection";  // Importando o MenuSection

const AdminMenu: React.FC = () => {
  const { menuOptions, alertMessage } = useAdminMenuModule();
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Menu para telas grandes */}
      <div className="hidden lg:block w-64">
        <SidebarMenu options={menuOptions} />
      </div>

      {/* Hamburger Menu para dispositivos móveis */}
      <div className="lg:hidden">
        <HamburgerMenu options={menuOptions} />
        {isMobileMenuVisible && (
          <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] z-10">
            <SidebarMenu options={menuOptions} />
          </div>
        )}
      </div>

      {/* Conteúdo principal com rolagem */}
      <div className="flex-1 flex flex-col items-center justify-start pt-10 p-6 bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] dark:from-[#1f2937] dark:to-[#374151] overflow-y-auto">
        {/* Alerta */}
        {alertMessage && (
          <div className="mb-6 w-full max-w-2xl mx-auto">
            <Alert type="warning" message={alertMessage} />
          </div>
        )}

        {/* Mensagem de Boas-Vindas */}
        <MenuSection
          title="Welcome to the Admin Panel!"
          description="As an administrator, you have full control over the clinic's operations. You can manage patients, staff, and define operation types. Explore the sections on the left to get started."
          iconColorClass="text-primary-500 dark:text-primary-300"
          backgroundClass="bg-white dark:bg-[#2d2f3f]"
          isWelcomeMessage={true}
        />

        {/* Seções principais com ícones e descrições */}
        <div className="mt-8 w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto max-h-screen">
          <MenuSection
            title="Manage Patients"
            description="Add, edit, delete, or deactivate patient records. Ensure that patient information is up-to-date and accurate for seamless care."
            Icon={FaUsersCog}
            iconColorClass="text-primary-500 dark:text-primary-300"
            backgroundClass="bg-white dark:bg-[#2d2f3f]"
          />
          <MenuSection
            title="Manage Staff"
            description="Manage staff roles, assign duties, and control permissions. Ensure smooth operations by organizing and updating staff details."
            Icon={FaUserAlt}
            iconColorClass="text-primary-500 dark:text-primary-300"
            backgroundClass="bg-white dark:bg-[#2d2f3f]"
          />
          <MenuSection
            title="Manage Operation Types"
            description="Define and manage various types of medical operations. Tailor the types to fit the needs of your clinic for efficient workflow."
            Icon={FaProcedures}
            iconColorClass="text-primary-500 dark:text-primary-300"
            backgroundClass="bg-white dark:bg-[#2d2f3f]"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
