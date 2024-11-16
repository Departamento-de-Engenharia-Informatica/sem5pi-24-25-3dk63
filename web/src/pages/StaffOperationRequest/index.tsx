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

const today = new Date().toISOString().split("T")[0];

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
    totalRequests,
    itemsPerPage,
    popupMessage,
    setPopupMessage,
    isDialogVisible,
    confirmDelete,
    cancelDelete,
    patients,
    operationTypes,
    isAddModalVisible,
    setIsAddModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    newRequest,
    setNewRequest,
    editingRequest,
    setEditingRequest,
    handleEditSubmit,
    handleSubmit,
    handleEdit,
  } = useOperationRequestModule(setAlertMessage);

  const totalPages = Math.ceil(totalRequests / itemsPerPage);

  const renderActions = (request: any) => {
    const options = [
      {
        label: "Edit",
        onClick: () => handleEdit(request),
        className: "text-blue-500 hover:text-blue-700 transition duration-200",
      },
      {
        label: "Delete",
        onClick: () => handleDelete(request["Id"]),
        className: "text-red-500 hover:text-red-700 transition duration-200",
      },
    ];
    return (
      <div className="flex flex-wrap gap-2">
        <DropdownMenu options={options} buttonLabel="Actions" />
      </div>
    );
  };

  const tableData = operationRequests.map((request) => ({
    ...request,
    "Id": request.id,
    Actions: renderActions(request),
  }));

  useEffect(() => {
    if (!isAddModalVisible) setNewRequest(null);
    if (!isEditModalVisible) setEditingRequest(null);
  }, [isAddModalVisible, isEditModalVisible]);


  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <button
            onClick={() => setIsAddModalVisible(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
          >
            Add Operation Request
          </button>
        </div>

        <SearchFilter
          attributes={["firstName", "lastName", "operationType", "status", "priority", "dateRequested", "dueDate"]}
          labels={{
            firstName: "First Name",
            lastName: "Last Name",
            operationType: "Operation Type",
            status: "Status",
            priority: "Priority",
            dateRequested: "Request date",
            dueDate: "Deadline",
          }}
          fieldTypes={{
            dateRequested: "date",
            dueDate: "date",
            status: "select",
            priority: "select",
          }}
          selectOptions={{
            status: ["Active", "Inactive"],
            priority: ["Emergency", "Urgent", "Elective"],
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

        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>

      {isAddModalVisible && (
        <Modal isVisible={isAddModalVisible} setIsVisible={setIsAddModalVisible} title="Create Operation Request">
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700">Patient</label>
            <select
              value={newRequest?.patientId || ""}
              onChange={(e) =>
                setNewRequest((prev: any) => ({
                  ...prev,
                  patientId: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="" disabled>Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id.value} value={patient.id.value}>
                  {`${patient.name.firstName} ${patient.name.lastName}`}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mt-4">Operation Type</label>
            <select
              value={newRequest?.operationType || ""}
              onChange={(e) =>
                setNewRequest((prev: any) => ({
                  ...prev,
                  operationType: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="" disabled>
                Select Operation Type
              </option>
              {operationTypes.map((operationType: any) => (
                <option key={operationType.id} value={operationType.id}>
                  {operationType.name.description}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mt-4">Deadline</label>
            <input
              type="date"
              value={newRequest?.deadline || ""}
              onChange={(e) =>
                setNewRequest((prev: any) => ({
                  ...prev,
                  deadline: e.target.value,
                }))
              }
              min={today}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">Priority</label>
            <select
              value={newRequest?.priority || ""}
              onChange={(e) =>
                setNewRequest((prev: any) => ({
                  ...prev,
                  priority: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="" disabled>
                Select Priority
              </option>
              <option value="Emergency">Emergency</option>
              <option value="Urgent">Urgent</option>
              <option value="Elective">Elective</option>
            </select>

            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {isEditModalVisible && (
        <Modal isVisible={isEditModalVisible} setIsVisible={setIsEditModalVisible} title="Edit operation request">
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mt-4">Deadline</label>
            <input
              type="date"
              value={editingRequest?.deadline || ""}
              onChange={(e) =>
                setEditingRequest((prev: any) => ({
                  ...prev,
                  deadline: e.target.value,
                }))
              }
              min={today}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">Priority</label>
            <select
              value={editingRequest?.priority || ""}
              onChange={(e) =>
                setEditingRequest((prev: any) => ({
                  ...prev,
                  priority: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="" disabled>
                Select priority
              </option> 
              <option value="Emergency">Emergency</option>
              <option value="Urgent">Urgent</option>
              <option value="Elective">Elective</option>
            </select>

            <button
              onClick={handleEditSubmit}
              className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-md"
            > 
              Save changes
            </button>
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
  );
};

export default OperationRequestList;
