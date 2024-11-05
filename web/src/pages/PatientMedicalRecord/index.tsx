import React from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Table";
import { useMedicalRecordsListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Pagination from "@/components/Pagination";

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
  } = useMedicalRecordsListModule(setAlertMessage);

  const totalPages = Math.ceil(totalMedicalRecords / itemsPerPage);

  const renderActions = (record: any) => (
    <div className="flex flex-wrap gap-2">

    </div>
  );

  const tableData = medicalRecords.map((record) => ({
    ...record,
    Actions: renderActions(record),
  }));

  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
        {loading && <Loading loadingText = {true} />}
        {error && <Alert type="error" message={error} />}
        {medicalRecords.length === 0 && !loading && (
          <Alert type="info" message="You don't have any medical records." />
        )}
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

export default MedicalRecordsList;
