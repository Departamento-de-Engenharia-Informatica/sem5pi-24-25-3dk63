import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IOperationRequestService } from "@/service/IService/IOperationRequestService";
import { IOperationTypeService } from "@/service/IService/IOperationTypeService";
import { IPatientService } from "@/service/IService/IPatientService";
import { useNavigate } from "react-router-dom";
import React from "react";
import { UpdateOperationRequestDTO } from "@/dto/UpdateOperationRequestDTO";
import { IStaffService } from "@/service/IService/IStaffService";
import { IUserService } from "@/service/IService/IUserService";
import { ISpecializationService } from "@/service/IService/ISpecializationService";

export const useOperationRequestModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const navigate = useNavigate();
  const operationRequestService = useInjection<IOperationRequestService>(TYPES.operationRequestService);
  const operationTypeService = useInjection<IOperationTypeService>(TYPES.operationTypeService);
  const patientService = useInjection<IPatientService>(TYPES.patientService);
  const staffService = useInjection<IStaffService>(TYPES.staffService);
  const userService = useInjection<IUserService>(TYPES.userService);
  const specializationService = useInjection<ISpecializationService>(TYPES.specializationsService);
  const [operationRequests, setOperationRequests] = useState<any[]>([]);
  const [filterOperationRequests, setFilterOperationRequests] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [operationTypes, setOperationTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [requestIdToDelete, setRequestIdToDelete] = useState<string | null>(null);
  const [doctorSpecialization, setDoctorSpecialization] = useState<string>("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newRequest, setNewRequest] = useState<any>(null);
  const [editingRequest, setEditingRequest] = useState<any | null>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [originalRequest, setOriginalRequest] = useState<any>(null);

  const itemsPerPage = 10;

  const headers = ["Patient Name", "Operation Type", "Priority", "Assigned Staff", "Deadline", "Status", "Actions"];

  const menuOptions = [
  {
    label: "Manage requests",
    action: () => navigate("/staff/operation-requests")
  },
  {
    label: "Open 3D",
    action: () => navigate("/staff/floor")
  },

  {
    label: "Surgery Rooms",
    action: () => navigate("/staff/surgery-rooms")
  }
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
      console.error( "Error searching operation request:", error);

      // Captura a mensagem específica do backend, se existir
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
  } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (request: any) => {
    const [day, month, year] = request.Deadline.split('-');
    const formattedDate = `${year}-${month}-${day}`;
  
    const originalValues = {
      Id: request.Id,
      deadline: formattedDate,
      priority: request.Priority
    };
    
    setOriginalRequest(originalValues);
    setEditingRequest(originalValues);
    setIsEditModalVisible(true);
  };

  const hasChanges = (original: any, current: any): boolean => {
    if (!original || !current) return false;
    
    return original.deadline !== current.deadline || 
           original.priority !== current.priority;
  };

  const getChangedFields = (original: any, current: any): Partial<UpdateOperationRequestDTO> => {
    const changes: Partial<UpdateOperationRequestDTO> = { 
      Id: original.Id 
    };

    if (original.deadline !== current.deadline) {
      changes.Deadline = current.deadline;
    }
    
    if (original.priority !== current.priority) {
      changes.Priority = current.priority;
    }

    return changes;
  };

  const handleEditSubmit = async () => {
    if (!editingRequest || !originalRequest) return;

    if (!hasChanges(originalRequest, editingRequest)) {
      setPopupMessage("No changes were made");
      setIsEditModalVisible(false);
      setEditingRequest(null);
      setOriginalRequest(null);
      return;
    }

    try {
      const changedFields = getChangedFields(originalRequest, editingRequest);
      
      if (Object.keys(changedFields).length <= 1) {
        setPopupMessage("No changes were made");
        setIsEditModalVisible(false);
        return;
      }

      await operationRequestService.editOperationRequest(changedFields);
      
      setPopupMessage("Operation request updated successfully");
      setIsEditModalVisible(false);
      fetchOperationRequests();
    } catch (error: any) {
      console.error("Error editing operation request:", error);
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          "An unknown error occurred";
      setPopupMessage(errorMessage);
    } finally {
      setEditingRequest(null);
      setOriginalRequest(null);
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
    } catch (error: any) {
      console.error( "Error deleting operation request:", error);

      // Captura a mensagem específica do backend, se existir
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
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
    const newOperationRequestDTO = {
      patientId: "",
      operationType: "",
      dateRequested: { date: "" },
      status: "",
    };

    setNewRequest(newOperationRequestDTO);
    setIsModalVisible(true);
  };

  const fetchActiveOperationTypes = async () => {
    try {
      const allOperationTypes = await operationTypeService.getOperationTypes();

      const activeOperationTypes = allOperationTypes.filter((operationType: any) => operationType.active);

      setFilterOperationRequests(activeOperationTypes);
    } catch (error: any) {
      console.error( "Error searching active operation types:", error);

      // Captura a mensagem específica do backend, se existir
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
  }
  };

  useEffect(() => {
    fetchActiveOperationTypes();
  }, []);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const operationTypes = await operationTypeService.getOperationTypes();
        const patients = await patientService.getPatients();

        const activePatients = patients.filter((patient) => patient.active);

        const userId = await userService.getUserId();
        if (!userId) {
          throw new Error("User ID not found");
        }

        const doctor = await staffService.getDoctor(userId);
        setDoctor(doctor);

        const specialization = specializationService.getSpecializationById(doctor.specializationId);

        const resolvedSpec = await specialization;

        const activeOperationTypes = operationTypes.filter((operationType) => operationType.active);
        
        const sameSpecializationTypes = activeOperationTypes.filter(
          (operationType) => operationType.specialization.value.includes(resolvedSpec.description)
        );
        
        setOperationTypes(sameSpecializationTypes);
        setPatients(activePatients);
      }catch (error: any) {
      console.error( "Error searching additional data:", error);

      // Captura a mensagem específica do backend, se existir
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
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

    } catch (error: any) {
      console.error( "Error searching operation request:", error);

      // Captura a mensagem específica do backend, se existir
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
  } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newRequest?.patientId || !newRequest?.operationType || !newRequest?.priority || !newRequest?.deadline) {
      setPopupMessage("All fields are required.");
      return;
    }
  
    try {
      const dto = await buildCreateDto(newRequest);
  
      await operationRequestService.createOperationRequest(dto);
  
      setPopupMessage("Operation request created successfully.");
  
      fetchOperationRequests();
  
      setIsModalVisible(false);
      setIsAddModalVisible(false);
      setNewRequest(null);
  
    } catch (error) {
      console.error('Error during submission:', error);
  
      setPopupMessage("There is already a request of this type for this patient.");
  
      setIsModalVisible(false);
      setIsAddModalVisible(false);
      setNewRequest(null);
    }
  };  

  const buildCreateDto = async (creatingRequest: any) => {
    try {

      const licenseNumber = doctor.licenseNumber;
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
    filterOperationRequests,
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
