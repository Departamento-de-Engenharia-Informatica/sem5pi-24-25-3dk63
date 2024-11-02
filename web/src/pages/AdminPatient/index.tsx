import React from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import { usePatientListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Button from "@/components/Button"; // Importando o botão
import SearchFilter from "@/components/SearchFilter";

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


  const renderActions = (patient: any) => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleDelete(patient.id)}
        className="flex-1 min-w-[100px] px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 text-sm"
      >
        Editar
      </button>
      <button
        onClick={() => handleDelete(patient.id)}
        className="flex-1 min-w-[100px] px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 text-sm"
      >
        Desativar
      </button>
      <button
        onClick={() => handleDelete(patient.id)}
        className="flex-1 min-w-[100px] px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 text-sm"
      >
        Eliminar
      </button>
    </div>
  );

 const tableData = patients.map((patient) => ({
    ...patient,
    Ações: renderActions(patient),
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
