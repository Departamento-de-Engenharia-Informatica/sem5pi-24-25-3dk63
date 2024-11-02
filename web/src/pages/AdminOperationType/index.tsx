import React, { useState } from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Table";
import { useOpTypesListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Pagination from "@/components/Pagination";

interface OperationTypeListProps {
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const OpTypesList: React.FC<OperationTypeListProps> = ({ setAlertMessage }) => {
  const {
    OTypes,
    loading,
    error,
    headers,
    menuOptions,
    totalOTypes,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleDeactivate,
    handleAddOperationType,
  } = useOpTypesListModule(setAlertMessage);

  const totalPages = Math.ceil(totalOTypes / itemsPerPage);

  const renderActions = (OTypes: any) => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleDeactivate(OTypes.id)}
        className="flex-1 min-w-[100px] px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 text-sm"
      >
        Desativar
      </button>
    </div>
  );

  const tableData = OTypes.map((OTypes) => ({
    ...OTypes,
    Ações: renderActions(OTypes),
  }));

  // Função para adicionar um novo Tipo de Operação

  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
        {loading && <Loading loadingText />}
        {error && <Alert type="error" message={error} />}
        <div className="mb-4">
          <button
            onClick={handleAddOperationType}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
          >
            Adicionar Tipo de Operação
          </button>
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
