import React, { useState } from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Card";
import { useMedicalRecordsListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Pagination from "@/components/Pagination";
import SidebarMenu from "@/components/SidebarMenu";
import Popup from "@/components/Popup";

interface MedicalRecordsListProps {
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const MedicalRecordsList: React.FC<MedicalRecordsListProps> = ({ setAlertMessage }) => {
  const {
    medicalRecords,
    loading,
    error,
    headers,
    menuOptions,
    totalMedicalRecords,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    popupMessage,
    setPopupMessage,
  } = useMedicalRecordsListModule(setAlertMessage);

  const totalPages = Math.ceil(totalMedicalRecords / itemsPerPage);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const renderActions = (record: any) => (
    <div className="flex flex-wrap gap-2">

    </div>
  );

  const tableData = medicalRecords.map((record) => ({
    ...record,
    Actions: renderActions(record),
  }));

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
    <div className={`lg:w-64 w-full ${isSidebarVisible ? 'block' : 'hidden'} lg:block`}>
      <SidebarMenu options={menuOptions} title = "Patient Panel"  basePath="/patient"/>
    </div>
    {/* Conteúdo principal */}

    <div className="flex-1 pt-20 pb-10 px-6 bg-[var(--background)] overflow-y-auto flex flex-col">
      {/* Hamburger Menu: Só visível em telas pequenas */}
      <div className="lg:hidden mb-4">
          <HamburgerMenu
            options={menuOptions}
          />
      </div>
        {loading && <Loading loadingText />}
        {error && <Alert type="error" message={error} />}
        <div className="overflow-x-auto overflow-y-auto">
          <Table
            headers={headers}
            data={tableData}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
        {/* Popup */}
        <Popup
          isVisible={!!popupMessage}
          setIsVisible={() => setPopupMessage(null)}
          message={popupMessage}
        />
    </div>
  </div>
  );
};

export default MedicalRecordsList;
