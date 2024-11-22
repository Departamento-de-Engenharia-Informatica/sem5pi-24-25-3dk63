import React, { useState } from "react";
import { useSurgeryRoomListModule } from "./module";
import Loading from "@/components/Loading";
import Alert from "@/components/Alert";
import Table from "@/components/Card";
import HamburgerMenu from "@/components/HamburgerMenu";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import SearchFilter from "@/components/SearchFilter";
import DropdownMenu from "@/components/DropdownMenu";
import Popup from "@/components/Popup";
import Confirmation from "@/components/Confirmation";
import SidebarMenu from "@/components/SidebarMenu";

interface SurgeryRoomListProps {
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const SurgeryRoomList: React.FC<SurgeryRoomListProps> = ({ setAlertMessage }) => {
  const {
    surgeryRooms,
    loading,
    error,
    headers,
    menuOptions,
    totalSurgeryRooms,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    roomNumber,
    setRoomNumber,
  } = useSurgeryRoomListModule(setAlertMessage);

  const totalPages = Math.ceil(totalSurgeryRooms / itemsPerPage);



  const tableData = surgeryRooms.map((surgeryRoom) => ({
    ...surgeryRoom,
  }));
 const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
    <div className={`lg:w-64 w-full ${isSidebarVisible ? 'block' : 'hidden'} lg:block`}>
          <SidebarMenu options={menuOptions} title = "Staff Panel"  basePath="/staff"/>
    </div>
    <div className="flex-1 pt-20 pb-10 px-6 bg-[var(--background)] overflow-y-auto flex flex-col">
    {/* Conteúdo principal */}
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
    </div>
  </div>
  );
};

export default SurgeryRoomList;
