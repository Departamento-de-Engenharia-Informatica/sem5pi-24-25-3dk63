import React from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import { usePatientListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Button from "@/components/Button";
import SearchFilter from "@/components/SearchFilter";
import DropdownMenu from "@/components/DropdownMenu";

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
    currentPage,
    setCurrentPage,
    searchPatients,
    handleDelete,
    totalPatients,
    itemsPerPage,
  } = usePatientListModule(setAlertMessage);

  const totalPages = Math.ceil(totalPatients / itemsPerPage);

  const renderActions = (patient: any) => {
    const options = [
      {
        label: "Editar",
        onClick: () => handleDelete(patient.id),
        className: "text-blue-500",
      },
      {
        label: "Desativar",
        onClick: () => handleDelete(patient.id),
        className: "text-yellow-500",
      },
      {
        label: "Eliminar",
        onClick: () => handleDelete(patient.id),
        className: "text-red-500",
      },
    ];

    return (
      <div className="flex flex-wrap gap-2">
        <DropdownMenu options={options} buttonLabel="Ações" />
      </div>
    );
  };

  const tableData = patients.map((patient) => ({
    ...patient,
    "": renderActions(patient),
  }));

  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
        <SearchFilter
          attributes={['Name', 'Email', 'dateOfBirth', 'medicalRecordNumber']}
          labels={{
            Name: 'Nome',
            Email: 'E-mail',
            dateOfBirth: 'Data de Nascimento',
            medicalRecordNumber: 'Medical Record Number'
          }}
          onSearch={searchPatients}
          results={[]}
          renderResult={() => <></>}
        />
        {loading && <Loading loadingText />}
        {error && <Alert type="error" message={error} />}
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

export default PatientList;
