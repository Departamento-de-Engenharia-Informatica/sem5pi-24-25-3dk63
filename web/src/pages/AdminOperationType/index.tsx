import React, { useState } from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Table";
import { useOpTypesListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";


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
    isModalVisible,
    setIsModalVisible,
    handleDeactivate,
    handleAddOperationType,
    creatingOperationType,
    setCreatingOperationType,
    saveOperationType,

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
      {isModalVisible && (
  <Modal
    isVisible={isModalVisible}
    setIsVisible={setIsModalVisible}
    title="Criar Novo Tipo de Operação"
  >
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700">Nome</label>
      <input
        type="text"
        value={creatingOperationType?.name || ""}
        onChange={(e) =>
          setCreatingOperationType((prev:any) => ({
            ...prev,
            name: e.target.value,
          }))
        }
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
      />

      <label className="block text-sm font-medium text-gray-700 mt-4">Tempo de Preparação</label>
      <input
        type="number"
        onChange={(e) =>
          setCreatingOperationType((prev:any) => ({
            ...prev,
            preparation: parseInt(e.target.value, 10),
          }))
        }
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
      />

      <label className="block text-sm font-medium text-gray-700 mt-4">Tempo de Cirurgia</label>
      <input
        type="number"
        onChange={(e) =>
          setCreatingOperationType((prev:any) => ({
            ...prev,
            surgery: parseInt(e.target.value, 10),
          }))
        }
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
      />

      <label className="block text-sm font-medium text-gray-700 mt-4">Tempo de Limpeza</label>
      <input
        type="number"
        onChange={(e) =>
          setCreatingOperationType((prev:any) => ({
            ...prev,
            cleaning: parseInt(e.target.value, 10),
          }))
        }
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
      />

      <label className="block text-sm font-medium text-gray-700 mt-4">Pessoal Necessário</label>
      <input
        type="number"
        onChange={(e) =>
          setCreatingOperationType((prev:any) => ({
            ...prev,
            requiredStaff: parseInt(e.target.value, 10),
          }))
        }
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
      />

      <label className="block text-sm font-medium text-gray-700 mt-4">Especialidade</label>
      <input
        type="text"
        onChange={(e) =>
          setCreatingOperationType((prev:any) => ({
            ...prev,
            speciality: e.target.value,
          }))
        }
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
      />

      <button
        onClick={saveOperationType}
        className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Salvar
      </button>
    </div>
  </Modal>
)}
    </div>
    
  );
};

export default OpTypesList;
