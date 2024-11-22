import React, { useState, useEffect } from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Card";
import { useAppointmentsListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Pagination from "@/components/Pagination";
import Checkbox from "@/components/CheckBox";
import SidebarMenu from "@/components/SidebarMenu";

interface AppointmentsListProps {
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
}



const AppointmentsList: React.FC<AppointmentsListProps> = ({ setAlertMessage }) => {
  const {
    appointments,
    loading,
    error,
    headers,
    menuOptions,
    totalAppointments,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    showActive,
    setShowActive,
    showInactive,
    setShowInactive,
  } = useAppointmentsListModule(setAlertMessage);

  const totalPages = Math.ceil(totalAppointments / itemsPerPage);

  const renderActions = (appointment: any) => (
    <div className="flex flex-wrap gap-2">

    </div>
  );

  const tableData = appointments.map((appointment) => ({
    ...appointment,
    Actions: renderActions(appointment),
  }));
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">      <HamburgerMenu options={menuOptions}/>
    <div className={`lg:w-64 w-full ${isSidebarVisible ? 'block' : 'hidden'} lg:block`}>
      <SidebarMenu options={menuOptions} title = "Patient Menu"  basePath="/patient"/>
    </div>

     <div className="flex-1 pt-20 pb-10 px-6 bg-[var(--background)] overflow-y-auto flex flex-col">
       <div className="lg:hidden mb-4">
          <HamburgerMenu
            options={menuOptions}
          />
        </div>
        <div className="mb-4 flex items-center">
          <Checkbox
            label="Active"
            checked={showActive}
            onChange={() => setShowActive(!showActive)}
          />
          <Checkbox
            label="Inactive"
            checked={showInactive}
            onChange={() => setShowInactive(!showInactive)}
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

export default AppointmentsList;
