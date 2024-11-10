import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IOperationRequestService } from "@/service/IService/IOperationRequestService";
import { useNavigate } from "react-router-dom";
import React from "react";
import { degToRad } from "three/src/math/MathUtils.js";
import { format } from "path";

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
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [requestIdToDelete, setRequestIdToDelete] = useState<string | null>(null);
  

  const itemsPerPage = 10;

  const headers = ["Patient Name", "Operation Type", "Priority", "Assigned Staff", "Deadline", "Status", "Actions"];

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
    { label: "Admin Menu", action: () => navigate("/admin") },
  ];

  const formatDate = (dateString: string) => {
    const dateParts = dateString.split('T')[0];
    console.log("Date parts: ", dateParts);
  
    const [year, month, day] = dateParts.split('-');
  
    return `${day}-${month}-${year}`;
  };
  

  const fetchOperationRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const requestsData = await operationRequestService.searchOperationRequests({});
      setTotalRequests(requestsData.length);

      const filteredData = requestsData.map((request) => ({
        "Patient Name": `${request.patientName}`,
        "Operation Type": request.operationType,
        Status: request.status,
        Priority: request.priority,
        Deadline : formatDate(request.deadline.toString()),
        "Assigned Staff": request.assignedStaff,
      }));

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedRequests = filteredData.slice(startIndex, startIndex + itemsPerPage);
      setOperationRequests(paginatedRequests);
      console.log("Operation Requests: ", paginatedRequests);
    } catch (error: any) {
      setError("Error fetching operation requests.");
      setAlertMessage("Error fetching operation requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    const requestToEdit = operationRequests.find(request => request.id === id);
    if (requestToEdit) {
      setCreatingRequest({
        id: requestToEdit.id,
        patientName: requestToEdit["Patient Name"],
        operationType: requestToEdit["Operation Type"],
        dateRequested: { date: requestToEdit["Date Requested"] },
        status: requestToEdit["Status"],
      });
      setIsModalVisible(true);
    }
  };

  const handleDelete = (id: string) => {
    setRequestIdToDelete(id);
    setIsDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (requestIdToDelete) {
      try {
        await operationRequestService.deleteOperationRequest(requestIdToDelete);
        setOperationRequests(prev => prev.filter(request => request.id !== requestIdToDelete));
        setAlertMessage("Operation request deleted successfully.");
        setPopupMessage("Operation request deleted successfully.");
      } catch (error) {
        setAlertMessage("Error deleting operation request.");
        setPopupMessage("Error while deleting operation request.");
      } finally {
        setIsDialogVisible(false);
        setRequestIdToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setIsDialogVisible(false);
    setRequestIdToDelete(null);
  };

  const handleAddRequest = () => {
    setCreatingRequest({
      patientName: "",
      operationType: "",
      dateRequested: { date: "" },
      status: "",
    });
    setIsModalVisible(true);
  };

  const buildUpdateDto = (updatedRequest: any) => {
    const updateDto: any = { id: updatedRequest.id };

    if (updatedRequest.patientName !== updatedRequest.patientName) {
      updateDto.patientName = updatedRequest.patientName;
    }

    if (updatedRequest.operationType !== updatedRequest.operationType) {
      updateDto.operationType = updatedRequest.operationType;
    }

    if (updatedRequest.status !== updatedRequest.status) {
      updateDto.status = updatedRequest.status;
    }

    return Object.keys(updateDto).length > 1 ? updateDto : null;
  };

  const buildCreateDto = (updatedRequest: any) => ({
    patientName: updatedRequest.patientName,
    operationType: updatedRequest.operationType,
    dateRequested: { date: updatedRequest.dateRequested.date },
    status: updatedRequest.status,
  });

  const searchOperationRequests = async (query: Record<string, string>) => {
    setLoading(true);
    setError(null);
    setOperationRequests([]);
    try {
      const requestsData = await operationRequestService.searchOperationRequests(query);
      const filteredData = requestsData.map((request) => ({
        "Patient Name": `${request.patientName}`,
        "Operation Type": request.operationType,
        Status: request.status,
        Priority: request.priority,
        Deadline : formatDate(request.deadline.toString()),
        "Assigned Staff": request.assignedStaff,
      }));
      setOperationRequests(filteredData);
    } catch (error) {
      setError("Error fetching operation requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationRequests();
  }, [currentPage]);

  return {
    loading,
    operationRequests,
    error,
    currentPage,
    totalRequests,
    isModalVisible,
    creatingRequest,
    popupMessage,
    isDialogVisible,
    requestIdToDelete,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleAddRequest,
    searchOperationRequests,
    menuOptions,
    headers,
    setCurrentPage,
    setIsModalVisible,
    setCreatingRequest,
    itemsPerPage,
    setPopupMessage,

  };
};
