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
import { ISpecializationService } from "@/service/IService/ISpecializationService";

export const useOperationRequestModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const navigate = useNavigate();
  const operationRequestService = useInjection<IOperationRequestService>(TYPES.operationRequestService);
  const operationTypeService = useInjection<IOperationTypeService>(TYPES.operationTypeService); // Inject operation type service
  const patientService = useInjection<IPatientService>(TYPES.patientService); // Inject patient service
  const staffService = useInjection<IStaffService>(TYPES.staffService);
  const userService = useInjection<IUserService>(TYPES.userService);
  const specializationService = useInjection<ISpecializationService>(TYPES.specializationsService);
  const [operationRequests, setOperationRequests] = useState<any[]>([]);
  const [filterOperationRequests, setFilterOperationRequests] = useState<any[]>([]);
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
  const [doctor, setDoctor] = useState<any>(null);
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
      } catch (error: any) {
      console.error( "Error editing operation request:", error);

      // Captura a mensagem específica do backend, se existir
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
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
          (operationType) => operationType.specialization.value === resolvedSpec.description
        );

        setOperationTypes(sameSpecializationTypes);
        setPatients(patients);
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
    try {
      if (!newRequest.patientId || !newRequest.operationType || !newRequest.priority || !newRequest.deadline) {
        setPopupMessage("All fields are required.");
        return;
      }

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
