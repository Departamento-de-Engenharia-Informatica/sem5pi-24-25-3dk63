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
    specializations
  } = useOpTypesListModule(setAlertMessage);

  const totalPages = Math.ceil(totalOTypes / itemsPerPage);

  const renderActions = (OTypes: any) => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleDeactivate(OTypes.id)}
        className="flex-1 min-w-[100px] px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 text-sm"
      >
        Deactivate
      </button>
    </div>
  );

  const tableData = OTypes.map((OTypes) => ({
    ...OTypes,
    Actions: renderActions(OTypes),
  }));

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
            Add Operation Type
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
          title="Create New Operation Type"
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
              onChange={(e) =>
                setCreatingOperationType((prev: any) => ({
                  ...prev,
                  preparation: parseInt(e.target.value, 10),
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">Surgery Time</label>
            <input
              type="number"
              onChange={(e) =>
                setCreatingOperationType((prev: any) => ({
                  ...prev,
                  surgery: parseInt(e.target.value, 10),
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">Cleaning Time</label>
            <input
              type="number"
              onChange={(e) =>
                setCreatingOperationType((prev: any) => ({
                  ...prev,
                  cleaning: parseInt(e.target.value, 10),
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">Required Staff</label>
            <input
              type="number"
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
              value={creatingOperationType?.speciality || ""}
              onChange={(e) =>
                setCreatingOperationType((prev: any) => ({
                  ...prev,
                  speciality: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="" disabled>Select Specialization</option>
              {specializations.map((spec) => (
                <option key={spec.id} value={spec.description}>
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
    </div>
  );
};

export default OpTypesList;