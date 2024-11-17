import React, { useState } from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Card";
import { useOpTypesListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Modal from "@/components/Modal";
import Popup from "@/components/Popup";
import Confirmation from "@/components/Confirmation";
import SearchFilter from "@/components/SearchFilter";
import DropdownMenu from "@/components/DropdownMenu";
import SidebarMenu from "@/components/SidebarMenu";

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
    handleEdit,
    creatingOperationType,
    setCreatingOperationType,
    saveOperationType,
    specializations,
    popupMessage,
    setPopupMessage,
    confirmDeactivate,
    setConfirmDeactivate,
    handleCancelDeactivate,
    searchOperationTypes,
  } = useOpTypesListModule(setAlertMessage);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const totalPages = Math.ceil(totalOTypes / itemsPerPage);


  const renderActions = (opType: any) => {
    const options = [
      {
        label: "Edit",
        onClick: () => handleEdit(opType.id),
        className: "text-blue-500",
      },
      {
        label: "Deactivate",
        onClick: () => handleDeactivate(opType.id),
        className: "flex-1 min-w-[100px] px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 text-sm",
      },
    ];

  return (
    <div className="flex flex-wrap gap-2">
      <DropdownMenu options={options} buttonLabel="Actions" />
    </div>
  );
};

  const tableData = OTypes.map((opType) => ({
    ...opType,
    actions: renderActions(opType),
  }));

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      <div className={`lg:w-64 w-full ${isSidebarVisible ? 'block' : 'hidden'} lg:block`}>
        <SidebarMenu options={menuOptions} />
      </div>
      {/* Conteúdo principal */}
    <div className="flex-1 pt-20 pb-10 px-6 bg-[var(--background)] overflow-y-auto flex flex-col">
      {/* Hamburger Menu: Só visível em telas pequenas */}
      <div className="lg:hidden mb-4">
        <HamburgerMenu
          options={menuOptions}
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        />
      </div>

        <div className="mb-4">
          <button
            onClick={handleAddOperationType}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
          >
            Add Operation Type
          </button>
        </div>
        <SearchFilter
          attributes={['name', 'specialization', 'active']}
          labels={{
            name: 'Name',
            specialization: 'Specialization',
            active: 'Active',
          }}
          fieldTypes={{
            active: 'select',
          }}
          selectOptions={{
            active: ['Yes', 'No'],
          }}
          onSearch={searchOperationTypes}
          results={[]}
          renderResult={() => <></>}
        />
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
      {/* Modal de Cadastro/edição */}

      {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          title={creatingOperationType?.id ? "Edit Operation Type" : "Create New Operation Type"}
        >
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={creatingOperationType?.name || ""}
              onChange={(e) =>
                setCreatingOperationType((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Preparation Time</label>
          <input
            type="number"
            value={creatingOperationType?.preparationTime || ""}
            min="1"
            onKeyDown={(e) => {
              if (e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
            onChange={(e) =>
              setCreatingOperationType((prev: any) => ({
                ...prev,
                preparationTime: parseInt(e.target.value, 10),
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Surgery Time</label>
          <input
            type="number"
            value={creatingOperationType?.surgeryTime || ""}
            min="1"
            onKeyDown={(e) => {
              if (e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
            onChange={(e) =>
              setCreatingOperationType((prev: any) => ({
                ...prev,
                surgeryTime: parseInt(e.target.value, 10),
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Cleaning Time</label>
          <input
            type="number"
            value={creatingOperationType?.cleaningTime || ""}
            min="1"
            onKeyDown={(e) => {
              if (e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
            onChange={(e) =>
              setCreatingOperationType((prev: any) => ({
                ...prev,
                cleaningTime: parseInt(e.target.value, 10),
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Required Staff</label>
          <input
            type="number"
            value={creatingOperationType?.requiredStaff || ""}
            min="1"
            onKeyDown={(e) => {
              if (e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
            onChange={(e) =>
              setCreatingOperationType((prev: any) => ({
                ...prev,
                requiredStaff: parseInt(e.target.value, 10),
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Specialization</label>
            <select
              value={creatingOperationType?.specialization || ""}
              onChange={(e) =>
                setCreatingOperationType((prev: any) => ({
                  ...prev,
                  specialization: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="" disabled>Select Specialization</option>
              {specializations.map((spec) => (
                <option key={`${spec.id}-${spec.description}`} value={spec.description}>
                  {spec.description}
                </option>
              ))}
            </select>

            <button
              onClick={saveOperationType}
              className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
      <Popup
        isVisible={!!popupMessage}
        setIsVisible={() => setPopupMessage(null)}
        message={popupMessage}
      />
      <Confirmation
      isVisible={!!confirmDeactivate}
      onConfirm={() => {
        if (confirmDeactivate) {
          confirmDeactivate(); // Chama a função de desativação
          setConfirmDeactivate(null); // Reseta o estado
        }
      }}
      onCancel={handleCancelDeactivate}
      message="Are you sure you want to deactivate this operation type?"
     />
    </div>

  );

};



export default OpTypesList;