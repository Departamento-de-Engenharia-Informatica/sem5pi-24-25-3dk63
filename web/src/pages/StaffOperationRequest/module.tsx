import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IOperationRequestService } from "@/service/IService/IOperationRequestService";
import { useNavigate } from "react-router-dom";

export const useOperationRequestListModule = (
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const navigate = useNavigate();
  const operationRequestService = useInjection<IOperationRequestService>(TYPES.operationRequestService);

  const [operationRequests, setOperationRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOperationRequests, setTotalOperationRequests] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [creatingOperationRequest, setCreatingOperationRequest] = useState<any | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const itemsPerPage = 10;

  const headers = [
    "Medical Record Number",
    "Priority",
    "License Number",
    "Operation Type",
    "Deadline",
    "Active",
    "Actions",
  ];

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
    { label: "Staff Menu", action: () => navigate("/staff") },
  ];

  const fetchOperationRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const requestsData = await operationRequestService.getOperationRequests();
      setTotalOperationRequests(requestsData.length);

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedRequests = requestsData.slice(startIndex, startIndex + itemsPerPage);
      setOperationRequests(paginatedRequests);
    } catch (error: any) {
      setError("Error fetching operation requests.");
      setAlertMessage("Error fetching operation requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this operation request?")) {
      try {
        await operationRequestService.deleteOperationRequest(id);
        setOperationRequests((prev) => prev.filter((request) => request.id !== id));
        setAlertMessage("Operation request deleted successfully.");
        setPopupMessage("Operation request deleted successfully.");
      } catch (error) {
        setAlertMessage("Error deleting operation request.");
        setPopupMessage("Error deleting operation request.");
      }
    }
  };

  const handleAddOperationRequest = () => {
    setCreatingOperationRequest({
      requesterName: "",
      dateRequested: "",
      status: "Pending",
    });
    setIsModalVisible(true);
  };

  const saveOperationRequest = async () => {
    if (!creatingOperationRequest) return;
    try {
      await operationRequestService.createOperationRequest(creatingOperationRequest);
      setAlertMessage("Operation request created successfully.");
      setIsModalVisible(false);
      fetchOperationRequests();
    } catch (error) {
      setAlertMessage("Error creating operation request.");
      setPopupMessage("Error creating operation request.");
    }
  };

  const searchOperationRequests = async (searchParams: any) => {
    try {
      const searchResults = await operationRequestService.searchOperationRequests(searchParams);
      setOperationRequests(searchResults);
    } catch (error) {
      setAlertMessage("Error searching operation requests.");
    }
  };

  useEffect(() => {
    fetchOperationRequests();
  }, [currentPage]);

  const renderActions = (request: any) => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleDelete(request.id)}
        className="flex-1 min-w-[100px] px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 text-sm"
      >
        Delete
      </button>
      <button
        onClick={() => {
          setCreatingOperationRequest(request);}}
        className="flex-1 min-w-[100px] px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 text-sm"
      >
        Edit
      </button>
    </div>
  );

  const tableData = operationRequests.map((request) => ({
    "Medical Record Number": request.medicalRecordNumber || "N/A",
    "Priority": request.priority || "N/A",
    "License Number": request.licenseNumber || "N/A",
    "Operation Type": request.operationType || "N/A",
    "Deadline": request.deadline ? new Date(request.deadline).toLocaleDateString() : "N/A",
    "Active": request.active ? "Yes" : "No",
    "Actions": renderActions(request),
  }));

  return {
    operationRequests,
    loading,
    error,
    headers,
    menuOptions,
    currentPage,
    setCurrentPage,
    searchOperationRequests,
    handleDelete,
    isModalVisible,
    setIsModalVisible,
    handleAddOperationRequest,
    creatingOperationRequest,
    setCreatingOperationRequest,
    saveOperationRequest,
    totalOperationRequests,
    itemsPerPage,
    popupMessage,
    setPopupMessage,
    tableData,
  };
};
