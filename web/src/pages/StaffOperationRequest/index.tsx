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

  const renderActions = (request: any) => {
    const options = [
      { label: "Edit", onClick: () => handleEdit(request.id), className: "text-blue-500" },
      { label: "Delete", onClick: () => handleDelete(request.id), className: "text-red-500" },
    ];
    return <DropdownMenu options={options} buttonLabel="Actions" />;
  };

  const tableData = operationRequests.map((request) => ({
    ...request,
    "": renderActions(request),
  }));

  useEffect(() => {
    if (!isModalVisible) {
      setCreatingRequest(null);
    }
  }, [isModalVisible]);

  return (
    <div className="relative min-h-screen bg-gray-100">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
        <button
          onClick={() => setIsModalVisible(true)}
          className="px-4 py-2 mb-4 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
        >
          Add Operation Request
        </button>

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

        {loading && <Loading />}
        {error && <Alert type="error" message={error} />}

        <div className="overflow-x-auto">
          <Table headers={headers} data={tableData} />
        </div>

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

        {isModalVisible && (
          <Modal
            isVisible={isModalVisible}
            setIsVisible={setIsModalVisible}
            title={creatingRequest?.id ? "Edit Operation Request" : "Create Operation Request"}
          >
            <div className="p-4">

              {/* REQUEST ID */}
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

              {/* OPERATION TYPE */}
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

              {/* PRIORITY */}
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

              {/* ASSIGNED STAFF */}
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

              {/* DEADLINE */}
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

              {/* STATUS */}
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
            </div>
          </Modal>
        )}

        <Popup isVisible={!!popupMessage} setIsVisible={() => setPopupMessage(null)} message={popupMessage} />

        <Confirmation
          isVisible={isDialogVisible}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          message="Are you sure you want to delete this request?"
        />
      </div>
    </div>
  );
};

export default OperationRequestList;
