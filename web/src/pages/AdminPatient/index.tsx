import React from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Table/Table";
import Pagination from "@/components/Pagination";
import { usePatientListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";

interface PatientListProps {
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const PatientList: React.FC<PatientListProps> = ({ setAlertMessage }) => {
  const {
    patients,
    loading,
    error,
    headers,
    menuOptions,
    totalPages,
    currentPage,
    setCurrentPage
  } = usePatientListModule(setAlertMessage);

  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
        {loading && <Loading loadingText />}
        {error && <Alert type="error" message={error} />}
        <div className="overflow-x-auto">
          <Table headers={headers} data={patients} />
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

export default PatientList;
