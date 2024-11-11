import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Alert from "@/components/Alert";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import { useOperationRequestModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import SearchFilter from "@/components/SearchFilter";
import DropdownMenu from "@/components/DropdownMenu";
import Modal from "@/components/Modal";
import Popup from "@/components/Popup";
import Confirmation from "@/components/Confirmation";

interface OperationRequestListProps {
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const OperationRequestList: React.FC<OperationRequestListProps> = ({ setAlertMessage }) => {
  const {
    operationRequests,
    loading,
    error,
    headers,
    menuOptions,
    currentPage,
    setCurrentPage,
    searchOperationRequests,
    handleDelete,
    handleEdit,
    isModalVisible,
    setIsModalVisible,
    creatingRequest,
    setCreatingRequest,
    totalRequests,
    itemsPerPage,
    popupMessage,
    setPopupMessage,
    isDialogVisible,
    confirmDelete,
    cancelDelete,
  } = useOperationRequestModule(setAlertMessage);

  const totalPages = Math.ceil(totalRequests / itemsPerPage);

  // Render dropdown actions for each request row
  const renderActions = (request: any) => {
    const options = [
      { 
        label: "Edit", 
        onClick: () => handleEdit(request.id), 
        className: "text-blue-500 hover:text-blue-700 transition duration-200" 
      },
      { 
        label: "Delete", 
        onClick: () => handleDelete(request.id), 
        className: "text-red-500 hover:text-red-700 transition duration-200" 
      },
    ];
    return <DropdownMenu options={options} buttonLabel="Actions" />;
  };

  const tableData = operationRequests.map((request) => ({
    ...request,
    actions: renderActions(request),
  }));

  useEffect(() => {
    if (!isModalVisible) {
      setCreatingRequest(null);
    }
  }, [isModalVisible]);

  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
        {/* Add Operation Request Button */}
        <div className="mb-4">
          <button
            onClick={() => setIsModalVisible(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
          >
            Add Operation Request
          </button>
        </div>

        {/* Search Filter */}
        <SearchFilter
          attributes={['firstName', 'lastName', 'operationType', 'status', 'priority', 'dateRequested', 'dueDate']}
          labels={{
            firstName: 'First Name',
            lastName: 'Last Name',
            operationType: 'Operation Type',
            status: 'Status',
            priority: 'Priority',
            dateRequested: 'Request date (dd-MM-yyyy)',
            dueDate: 'Deadline (dd-MM-yyyy)',
          }}
          onSearch={searchOperationRequests}
          results={[]}
          renderResult={() => <></>}
        />

        {/* Loading & Error States */}
        {loading && <Loading />}
        {error && <Alert type="error" message={error} />}

        {/* Table */}
        <div className="overflow-x-auto">
          <Table headers={headers} data={tableData} />
        </div>

        {/* Pagination */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal for Creating/Editing Request */}
      {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          title={creatingRequest?.id ? "Edit Operation Request" : "Create Operation Request"}
        >
          <div className="p-4">
            {/* Request ID */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Request ID</label>
            <input
              type="text"
              value={creatingRequest?.requestID || ""}
              onChange={(e) =>
                setCreatingRequest((prev: any) => ({
                  ...prev,
                  requestID: e.target.value,
                }))
              }
              placeholder="Enter request ID"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />

            {/* Operation Type */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Operation Type</label>
            <input
              type="text"
              value={creatingRequest?.operationType || ""}
              onChange={(e) =>
                setCreatingRequest((prev: any) => ({
                  ...prev,
                  operationType: e.target.value,
                }))
              }
              placeholder="Enter operation type"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />

            {/* Priority */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Priority</label>
            <select
              value={creatingRequest?.priority || ""}
              onChange={(e) =>
                setCreatingRequest((prev: any) => ({
                  ...prev,
                  priority: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="" disabled>Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Assigned Staff */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Assigned Staff</label>
            <input
              type="text"
              value={creatingRequest?.assignedStaff || ""}
              onChange={(e) =>
                setCreatingRequest((prev: any) => ({
                  ...prev,
                  assignedStaff: e.target.value,
                }))
              }
              placeholder="Enter assigned staff"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />

            {/* Deadline */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Deadline</label>
            <input
              type="date"
              value={creatingRequest?.deadline || ""}
              onChange={(e) =>
                setCreatingRequest((prev: any) => ({
                  ...prev,
                  deadline: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />

            {/* Status */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Status</label>
            <select
              value={creatingRequest?.status || ""}
              onChange={(e) =>
                setCreatingRequest((prev: any) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="" disabled>Select Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Save Button */}
            <button
              onClick={() => {}}
              className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {/* Popup */}
      <Popup
        isVisible={!!popupMessage}
        setIsVisible={() => setPopupMessage(null)}
        message={popupMessage}
      />

      {/* Confirmation Dialog */}
      <Confirmation
        isVisible={isDialogVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Are you sure you want to delete this request?"
      />
    </div>
  );
};

export default OperationRequestList;
