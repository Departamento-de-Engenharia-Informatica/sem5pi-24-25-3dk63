import React from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Card";
import { useAppointmentsListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Pagination from "@/components/Pagination";
import Checkbox from "@/components/CheckBox";

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

  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
        {loading && <Loading loadingText={true} />}
        {error && <Alert type="error" message={error} />}
        {!loading && appointments.length === 0 && (
          <Alert type="info" message="You don't have any appointments." />
        )}
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

export default AppointmentsList;
