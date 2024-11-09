import React, { useState } from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Table";
import { useOperationRequestListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import Popup from "@/components/Popup";

interface OperationRequestListProps {
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const OpRequestsList: React.FC<OperationRequestListProps> = ({ setAlertMessage }) => {
  const {
    operationRequests,
    loading,
    error,
    headers,
    menuOptions,
    totalOperationRequests,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    isModalVisible,
    setIsModalVisible,
    handleDelete,
    handleAddOperationRequest,
    creatingOperationRequest,
    setCreatingOperationRequest,
    saveOperationRequest,
    popupMessage,
    setPopupMessage,

  } = useOperationRequestListModule(setAlertMessage);

  const totalPages = Math.ceil(totalOperationRequests / itemsPerPage);

  const renderActions = (request: any) => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleDelete(request.id)}
        className="flex-1 min-w-[100px] px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 text-sm"
      >
        Delete
      </button>
    </div>
  );

  const tableData = operationRequests.map((request) => ({
    ...request,
    Actions: renderActions(request),
  }));

  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
        {loading && <Loading loadingText />}
        {error && <Alert type="error" message={error} />}
        <div className="mb-4">
          <button
            onClick={handleAddOperationRequest}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
          >
            Add Operation Request
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
          title="Create New Operation Request"
        >
          <div className="p-4">
            {/* Form to Create New Operation Request */}
            <label className="block text-sm font-medium text-gray-700">Requester Name</label>
            <input
              type="text"
              value={creatingOperationRequest?.requesterName || ""}
              onChange={(e) =>
                setCreatingOperationRequest((prev: any) => ({
                  ...prev,
                  requesterName: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter requester name"
              title="Requester Name"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">Date Requested</label>
            <input
              type="date"
              value={creatingOperationRequest?.dateRequested || ""}
              onChange={(e) =>
                setCreatingOperationRequest((prev: any) => ({
                  ...prev,
                  dateRequested: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
              title="Date Requested"
              placeholder="Select date requested"
            />

            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mt-4">Priority</label>
            <select
              id="priority"
              value={creatingOperationRequest?.priority || ""}
              onChange={(e) =>
                setCreatingOperationRequest((prev: any) => ({
                  ...prev,
                  priority: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <label className="block text-sm font-medium text-gray-700 mt-4">Operation Type</label>
            <input
              type="text"
              value={creatingOperationRequest?.operationType || ""}
              onChange={(e) =>
                setCreatingOperationRequest((prev: any) => ({
                  ...prev,
                  operationType: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter operation type"
            />

            <button
              onClick={saveOperationRequest}
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
      
    </div>
  );
};

export default OpRequestsList;
