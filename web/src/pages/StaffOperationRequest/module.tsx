import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IOperationRequestService } from "@/service/IService/IOperationRequestService";
import { IOperationTypeService } from "@/service/IService/IOperationTypeService";  // NEW: Service for operation types
import { IPatientService } from "@/service/IService/IPatientService";  // NEW: Service for fetching patients
import { useNavigate } from "react-router-dom";
import React from "react";
import { degToRad } from "three/src/math/MathUtils.js";
import { format } from "path";

export const useOperationRequestModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const navigate = useNavigate();
  const operationRequestService = useInjection<IOperationRequestService>(TYPES.operationRequestService);
  const operationTypeService = useInjection<IOperationTypeService>(TYPES.operationTypeService); // NEW: Inject operation type service
  const patientService = useInjection<IPatientService>(TYPES.patientService); // NEW: Inject patient service

  const [operationRequests, setOperationRequests] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);; // NEW: State to hold list of patients
  const [operationTypes, setOperationTypes] = useState<any[]>([]);; // NEW: State for operation types
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [creatingRequest, setCreatingRequest] = useState<any | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [requestIdToDelete, setRequestIdToDelete] = useState<string | null>(null);
  const [doctorSpecialization, setDoctorSpecialization] = useState<string>(""); // NEW: State for doctor's specialization

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
        Deadline: formatDate(request.deadline.toString()),
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
        Deadline: formatDate(request.deadline.toString()),
        "Assigned Staff": request.assignedStaff,
      }));
      setOperationRequests(filteredData);
    } catch (error) {
      setError("Error fetching operation requests.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch operation types and patients
  const fetchAdditionalData = async () => {
    try {
      setLoading(true);
      const [operationTypesData, patientsData] = await Promise.all([
        operationTypeService.getOperationTypes(),
        patientService.getPatients(),
      ]);
      setOperationTypes(operationTypesData);
      setPatients(patientsData);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch additional data");
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (!creatingRequest.patientName || !creatingRequest.operationType || !creatingRequest.status) {
        setAlertMessage("All fields are required");
        return;
      }

      // Ensure operation type matches doctor's specialization
      const doctorSpecializationMatch = operationTypes.some(
        (op: any) => op.id === creatingRequest.operationType && op.specialization === doctorSpecialization
      );
      if (!doctorSpecializationMatch) {
        setAlertMessage("The selected operation type does not match your specialization.");
        return;
      }

      const dto = creatingRequest.id ? buildUpdateDto(creatingRequest) : buildCreateDto(creatingRequest);
      // if (dto) {
      //   if (creatingRequest.id) {
      //     await operationRequestService.updateOperationRequest(dto);
      //     setPopupMessage("Operation request updated successfully");
      //   } else {
      //     await operationRequestService.createOperationRequest(dto);
      //     setPopupMessage("Operation request created successfully");
      //   }
      //   setIsModalVisible(false);
      //   setCreatingRequest(null);
      // }
    } catch (error) {
      setAlertMessage("Failed to submit operation request.");
    }
  };

  useEffect(() => {
    fetchOperationRequests();
    fetchAdditionalData(); // Fetch patients and operation types when component mounts
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
    handleSubmit, // NEW: Return the handleSubmit function
    patients, // NEW: Return patients list
    operationTypes, // NEW: Return operation types list
  };
};
