import React, { useState } from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Table";
import { useAppointmentsListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import Checkbox from "@/components/CheckBox"; // Importando o novo componente

interface OperationTypeListProps {
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const OpTypesList: React.FC<OperationTypeListProps> = ({ setAlertMessage }) => {
  const {
    Appointments,
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

  const renderActions = (OTypes: any) => (
    <div className="flex flex-wrap gap-2">
    </div>
  );

  const tableData = Appointments.map((Appointments) => ({
    ...Appointments,
    Actions: renderActions(Appointments),
  }));

  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
        {loading && <Loading loadingText />}
        {error && <Alert type="error" message={error} />}
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
        <div className="overflow-x-auto">
          <Table headers={headers} data={tableData} />
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default OpTypesList;
