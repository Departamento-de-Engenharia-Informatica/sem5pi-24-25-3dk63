import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IOperationRequestService } from "@/service/IService/IOperationRequestService";
import { useNavigate } from "react-router-dom";

export const useOperationRequestModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const navigate = useNavigate();
  const operationRequestService = useInjection<IOperationRequestService>(TYPES.operationRequestService);

  const [operationRequests, setOperationRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [creatingRequest, setCreatingRequest] = useState<any | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const itemsPerPage = 10;

  const headers = ["Patient Name", "Operation Type", "Priority", "Assigned Staff", "Deadline", "Status", "Actions"];

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
    { label: "Admin Menu", action: () => navigate("/admin") },
  ];

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const requestsData = await operationRequestService.searchOperationRequests({});
      setTotalRequests(requestsData.length);
      const paginatedRequests = requestsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      setOperationRequests(paginatedRequests);
      console.log("Operation requests:", paginatedRequests);
    } catch (error: any) {
      console.error("Error fetching operation requests:", error);
      setError("Failed to fetch operation requests.");
      setAlertMessage("Failed to fetch operation requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await operationRequestService.deleteOperationRequest(id);
        setOperationRequests((prev) => prev.filter((req) => req.id !== id));
        setPopupMessage("Operation request deleted successfully.");
      } catch (error) {
        console.error("Error deleting request:", error);
        setPopupMessage("Error deleting operation request.");
      }
    }
  };

  const saveRequest = async () => {
    if (!creatingRequest) return;
    try {
      await operationRequestService.createOperationRequest(creatingRequest);
      setIsModalVisible(false);
      fetchRequests();
    } catch (error) {
      console.error("Error saving request:", error);
      setPopupMessage("Error saving operation request.");
    }
  };

  const searchRequests = async (query: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const requestsData = await operationRequestService.searchOperationRequests(query);
      setOperationRequests(requestsData);
    } catch (error) {
      setError("Error searching operation requests.");
      console.error("Error searching requests:", error);
      setAlertMessage("Error searching operation requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage]);

  return {
    operationRequests,
    loading,
    error,
    headers,
    menuOptions,
    currentPage,
    setCurrentPage,
    handleDelete,
    isModalVisible,
    setIsModalVisible,
    creatingRequest,
    setCreatingRequest,
    saveRequest,
    totalRequests,
    itemsPerPage,
    searchRequests,
    popupMessage,
    setPopupMessage,
  };
};
