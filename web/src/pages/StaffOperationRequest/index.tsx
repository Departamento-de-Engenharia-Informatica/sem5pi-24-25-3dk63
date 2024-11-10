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
    searchRequests,
    handleDelete,
    isModalVisible,
    setIsModalVisible,
    creatingRequest,
    setCreatingRequest,
    saveRequest,
    totalRequests,
    itemsPerPage,
    popupMessage,
    setPopupMessage,
  } = useOperationRequestModule(setAlertMessage);

  const totalPages = Math.ceil(totalRequests / itemsPerPage);

  const renderActions = (request: any) => {
    const options = [
      { label: "Edit", onClick: () => handleDelete(request.id), className: "text-blue-500" },
      { label: "Delete", onClick: () => handleDelete(request.id), className: "text-red-500" },
    ];
    return <DropdownMenu options={options} buttonLabel="Actions" />;
  };

  
  const tableData = operationRequests.map((request) => ({
    patientName: request.patientName,
    operationType: request.operationType,
    priority: request.priority,
    assignedStaff: request.assignedStaff,
    deadline: new Date(request.deadline).toLocaleDateString(),
    status: request.status,
    actions: renderActions(request),
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
            dateRequested: 'Date Requested (dd-MM-yyyy)',
            dueDate: 'Due Date (dd-MM-yyyy)',
          }}
          onSearch={searchRequests}
          results={[]}
          renderResult={() => <></>}
        />

        {loading && <Loading />}
        {error && <Alert type="error" message={error} />}

        <Table headers={headers} data={tableData} />

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

        {isModalVisible && (
          <Modal
            isVisible={isModalVisible}
            setIsVisible={setIsModalVisible}
            title="Create Operation Request"
          >
            <div>
              <label>Request ID</label>
              <input
                type="text"
                value={creatingRequest?.requestID || ""}
                onChange={(e) =>
                  setCreatingRequest((prev: any) => ({
                    ...prev,
                    requestID: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border rounded mt-2"
              />
              <button
                onClick={saveRequest}
                className="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </Modal>
        )}

        <Popup isVisible={!!popupMessage} setIsVisible={() => setPopupMessage(null)} message={popupMessage} />
      </div>
    </div>
  );
};

export default OperationRequestList;
