import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IOperationRequestService } from "@/service/IService/IOperationRequestService";
import { IOperationTypeService } from "@/service/IService/IOperationTypeService";  // Service for operation types
import { IPatientService } from "@/service/IService/IPatientService";  // Service for fetching patients
import { useNavigate } from "react-router-dom";
import React from "react";
import { UpdateOperationRequestDTO } from "@/dto/UpdateOperationRequestDTO";
import { set } from "node_modules/cypress/types/lodash";
import { StaffService } from "@/service/staffService";
import { IStaffService } from "@/service/IService/IStaffService";
import { IUserService } from "@/service/IService/IUserService";

export const useOperationRequestModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const navigate = useNavigate();
  const operationRequestService = useInjection<IOperationRequestService>(TYPES.operationRequestService);
  const operationTypeService = useInjection<IOperationTypeService>(TYPES.operationTypeService); // Inject operation type service
  const patientService = useInjection<IPatientService>(TYPES.patientService); // Inject patient service
  const staffService = useInjection<IStaffService>(TYPES.staffService);
  const userService = useInjection<IUserService>(TYPES.userService);

  const [operationRequests, setOperationRequests] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]); // State to hold list of patients
  const [operationTypes, setOperationTypes] = useState<any[]>([]); // State for operation types
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [requestIdToDelete, setRequestIdToDelete] = useState<string | null>(null);
  const [doctorSpecialization, setDoctorSpecialization] = useState<string>(""); // State for doctor's specialization
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newRequest, setNewRequest] = useState<any>(null);
  const [editingRequest, setEditingRequest] = useState<any | null>(null);
  const itemsPerPage = 10;

  const headers = ["Patient Name", "Operation Type", "Priority", "Assigned Staff", "Deadline", "Status", "Actions"];

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
    { label: "Staff Menu", action: () => navigate("/staff") },
  ];

  const formatDate = (dateString: string) => {
    const dateParts = dateString.split('T')[0];
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
        "Id": request.id,
      }));

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedRequests = filteredData.slice(startIndex, startIndex + itemsPerPage);
      setOperationRequests(paginatedRequests);
    } catch (error: any) {
      setError("Error fetching operation requests.");
      setAlertMessage("Error fetching operation requests.");
    } finally {
      setLoading(false);
    }
  };

  const buildOperationUpdateDTO = (originalRequest: any, updatedFields: any) => {
    const updatedRequestDTO: UpdateOperationRequestDTO = { Id: originalRequest.Id };
  
    if (updatedFields.deadline) updatedRequestDTO.Deadline = updatedFields.deadline;
    if (updatedFields.priority) updatedRequestDTO.Priority = updatedFields.priority;
  
    return updatedRequestDTO;
  };
  
  const handleEdit = async (request: any) => {
    const updatedFields = {
      deadline: request.deadline,
      priority: request.priority,
    };
  
    const updatedRequestDTO = buildOperationUpdateDTO(request, updatedFields);
  
    if (!updatedRequestDTO.Id) {
      setAlertMessage("Request ID is missing.");
      return;
    }
  
    setEditingRequest(updatedRequestDTO);
    setIsEditModalVisible(true);
  };
  
  const handleEditSubmit = async () => {
    if (editingRequest) {
      try {
        await operationRequestService.editOperationRequest(editingRequest);
        setPopupMessage("Operation request updated successfully.");
        setIsEditModalVisible(false);
        setIsModalVisible(false);
        fetchOperationRequests();
      } catch (error) {
        setIsEditModalVisible(false);
        setIsModalVisible(false);
        setPopupMessage("Error updating operation request.");
      } finally {
        setEditingRequest(null);
      }
    }
  };

  const handleDelete = (id: string) => {
    setRequestIdToDelete(id);
    console.log("Deleting operation request:", id);
    setIsDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (!requestIdToDelete) {
        console.error("No requestIdToDelete set. Aborting delete.");
        return;
    }

    try {
        await operationRequestService.deleteOperationRequest(requestIdToDelete);
        console.log("Request deleted successfully:", requestIdToDelete);
        setOperationRequests((prev) =>
            prev.filter((request) => request.id !== requestIdToDelete)
        );
        setAlertMessage("Operation request deleted successfully.");
        setPopupMessage("Operation request deleted successfully.");
    } catch (error) {
        console.error("Error deleting operation request:", error);
        setAlertMessage("Error deleting operation request.");
        setPopupMessage("Error while deleting operation request.");
    } finally {
        setIsDialogVisible(false);
        setRequestIdToDelete(null);
        fetchOperationRequests();
    }
};


  const cancelDelete = () => {
    setIsDialogVisible(false);
    setRequestIdToDelete(null);
  };

  const handleAddRequest = () => {
    console.log("Add new Operation Request");
    const newOperationRequestDTO = {
      patientId: "",
      operationType: "",
      dateRequested: { date: "" },
      status: "",
    };
    console.log("New Operation Request:", newOperationRequestDTO);

    setNewRequest(newOperationRequestDTO);
    setIsModalVisible(true);
  };

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const operationTypes = await operationTypeService.getOperationTypes();
        const patients = await patientService.getPatients();
    
        const activeOperationTypes = operationTypes.filter((operationType) => operationType.active);
  
        setOperationTypes(activeOperationTypes);
        setPatients(patients);
      } catch (error) {
        console.error("Failed to fetch additional data:", error);
      }
    };    
  
    if (isAddModalVisible) {
      fetchAdditionalData();
    }
  }, [isAddModalVisible]);
  

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
        "Id": request.id,
      }));
      setOperationRequests(filteredData);
      if (filteredData.length === 0) {
        setAlertMessage("No operation requests found.");
      }

    } catch (error) {
      setError("Error fetching operation requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {

      if (!newRequest.patientId || !newRequest.operationType || !newRequest.priority || !newRequest.deadline) {
        setAlertMessage("All fields are required");
        return;
      }

      const dto = buildCreateDto(newRequest);

      await operationRequestService.createOperationRequest(await dto);
      setAlertMessage("Operation request created successfully");
        
      setIsModalVisible(false);
      setNewRequest(null);
       
    } catch (error) {
      setAlertMessage("Failed to submit operation request.");
    }
  };

  const buildCreateDto = async (creatingRequest: any) => {
    try {
      const userId = await userService.getUserId();
      if (!userId) {
        throw new Error('User ID not found');
      }
  
      const licenseNumber = await staffService.getDoctorLicenseNumber(userId);
      if (!licenseNumber) {
        throw new Error('License number not found');
      }
  
      return {
        deadline: {
          value: creatingRequest.deadline,
        },
        priority: {
          value: creatingRequest.priority,
        },
        licenseNumber: {
          value: licenseNumber,
        },
        medicalRecordNumber: {
          value: creatingRequest.patientId,
        },
        operationTypeId: {
          value: creatingRequest.operationType,
        },
      };
    } catch (error) {
      console.error('Error building DTO:', error);
      throw error;
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
    popupMessage,
    isDialogVisible,
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
    doctorSpecialization,
    setDoctorSpecialization,
    isAddModalVisible,
    setIsAddModalVisible,
    isEditModalVisible,
    setIsEditModalVisible,
    newRequest,
    setNewRequest,
    editingRequest,
    setEditingRequest,
    handleEditSubmit,
    itemsPerPage,
    setPopupMessage,
    handleSubmit, // Returning handleSubmit
    patients, // Return patients list
    operationTypes, // Return operation types list
  };
};
