import React, { useState } from "react";
import { useStaffMenuModule } from "./module";
import SidebarMenu from "@/components/SidebarMenu";
import HamburgerMenu from "@/components/HamburgerMenu";
import Alert from "@/components/Alert/index";
import { FaUserNurse, FaClipboardList, FaHospital } from "react-icons/fa";
import MenuSection from "@/components/MenuSection";

const OperationRequestMenu: React.FC = () => {
  const { menuOptions, alertMessage } = useStaffMenuModule();
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Menu para telas grandes */}
      <div className="hidden lg:block w-64">
        <SidebarMenu options={menuOptions} title="Staff Panel" basePath="/staff" />
      </div>

      {/* Hamburger Menu para dispositivos móveis */}
      <div className="lg:hidden">
        <HamburgerMenu options={menuOptions} />
        {isMobileMenuVisible && (
          <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] z-10">
            <SidebarMenu options={menuOptions} title="Staff Panel" />
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
          title="Welcome to the Staff Panel!"
          description="As a staff member, you can manage patient care, access operation requests, and review assigned tasks. Use the sections on the left to navigate."
          iconColorClass="text-primary-500 dark:text-primary-300"
          backgroundClass="bg-white dark:bg-[#2d2f3f]"
          isWelcomeMessage={true}
        />

        {/* Seções principais com ícones e descrições */}
        <div className="mt-8 w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto max-h-screen">
          <MenuSection
            title="Patient Care"
            description="View and update patient records, ensure accurate medical history, and manage assigned care plans."
            Icon={FaUserNurse}
            iconColorClass="text-primary-500 dark:text-primary-300"
            backgroundClass="bg-white dark:bg-[#2d2f3f]"
          />
          <MenuSection
            title="Task Management"
            description="Review and manage your assigned tasks. Stay organized and ensure timely completion of your responsibilities."
            Icon={FaClipboardList}
            iconColorClass="text-primary-500 dark:text-primary-300"
            backgroundClass="bg-white dark:bg-[#2d2f3f]"
          />
          <MenuSection
            title="Operation Requests"
            description="Review and process operation requests. Coordinate with other staff members to ensure smooth scheduling."
            Icon={FaHospital}
            iconColorClass="text-primary-500 dark:text-primary-300"
            backgroundClass="bg-white dark:bg-[#2d2f3f]"
          />
        </div>
      </div>
    </div>
  );
};

export default OperationRequestMenu;
