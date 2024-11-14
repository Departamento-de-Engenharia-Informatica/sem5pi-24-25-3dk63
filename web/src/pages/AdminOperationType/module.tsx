import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IOperationTypeService } from "@/service/IService/IOperationTypeService";
import { ISpecializationService } from "@/service/IService/ISpecializationService";
import { useNavigate } from "react-router-dom";
import { UpdateOperationTypeDTO } from "@/dto/UpdateOperationTypeDTO";

export const useOpTypesListModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const navigate = useNavigate();
  const operationTypeService = useInjection<IOperationTypeService>(TYPES.operationTypeService);
  const specializationsService = useInjection<ISpecializationService>(TYPES.specializationsService);

  const [OTypes, setOTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalOTypes, setTotalOTypes] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [creatingOperationType, setCreatingOperationType] = useState<any | null>(null);
  const [editingOperationType, setEditingOperationType] = useState<any | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [showActive, setShowActive] = useState<boolean>(true);
  const [showInactive, setShowInactive] = useState<boolean>(true);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState<(() => void) | null>(null);
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);


  const itemsPerPage = 10;

  const headers = [
    "Name",
    "Required Staff",
    "Preparation Time",
    "Surgery Time",
    "Cleaning Time",
    "Total Time",
    "Specialization",
    "Active",
    "Actions",
  ];

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
    { label: "Admin Menu", action: () => navigate("/admin") },
  ];

  const fetchOperationsTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const opsTypedata = await operationTypeService.getOperationTypes();
      setTotalOTypes(opsTypedata.length);

      const filteredData = opsTypedata
        .filter((OperationType) => {
          // Filtrar com base nas checkboxes de status
          if (showActive && showInactive) {
            return true; // Mostrar todos
          } else if (showActive) {
            return OperationType.active;
          } else if (showInactive) {
            return !OperationType.active;
          } else {
            return false;
          }
        })
        .map((OperationType) => ({
          id: OperationType.id,
          Name: OperationType.name.description,
          "Required Staff": OperationType.requiredStaff.requiredNumber,
          "Preparation Time": OperationType.duration.preparationPhase,
          "Surgery Time": OperationType.duration.surgeryPhase,
          "Cleaning Time": OperationType.duration.cleaningPhase,
          "Total Time": OperationType.duration.totalDuration,
          Specialization: OperationType.specialization.value,
          Active: OperationType.active ? "Yes" : "No",
        }));

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedOperationTypes = filteredData.slice(startIndex, startIndex + itemsPerPage);
      setOTypes(paginatedOperationTypes);
    } catch (error) {
      setError("Error fetching operation types.");
      setAlertMessage("Error fetching operation types.");
    } finally {
      setLoading(false);
    }
  };

const buildOperationUpdateDTO = (originalRequest: any, updatedFields: any) => {
  const updatedRequestDTO: UpdateOperationTypeDTO = { Id: originalRequest.Id };

  if (updatedFields.name) updatedRequestDTO.Name = updatedFields.name;
  if (updatedFields.requiredStaff) updatedRequestDTO.RequiredStaff = updatedFields.requiredStaff;
  if (updatedFields.preparationTime) updatedRequestDTO.PreparationTime = updatedFields.preparationTime;
  if (updatedFields.surgeryTime) updatedRequestDTO.SurgeryTime = updatedFields.surgeryTime;
  if (updatedFields.cleaningTime) updatedRequestDTO.CleaningTime = updatedFields.cleaningTime;
  if (updatedFields.speciality) updatedRequestDTO.Speciality = updatedFields.speciality;

  return updatedRequestDTO;
};

const handleEdit = async (id: string) => {
  fetchSpecializations();
  const opTypeToEdit = OTypes.find((opType) => opType.id === id);

  if (opTypeToEdit) {
    setCreatingOperationType({
      id: opTypeToEdit.id,
      name: opTypeToEdit.Name,
      requiredStaff: opTypeToEdit["Required Staff"],
      preparationTime: opTypeToEdit["Preparation Time"],
      surgeryTime: opTypeToEdit["Surgery Time"],
      cleaningTime: opTypeToEdit["Cleaning Time"],
      totalDuration: opTypeToEdit["Total Time"],
      specialization: opTypeToEdit.Specialization,
    });

    setIsModalVisible(true);
  }
};


  const handleDeactivate = (id: string) => {
    // Exibe o modal de confirmação
    setConfirmDeactivate(() => async () => {
      try {
        console.log("Deactivating Operation Type with id:", id);
        await operationTypeService.deactivateOperationType(id);
        fetchOperationsTypes();
        setPopupMessage("Operation Type deactivated successfully.");
      } catch (error) {
        console.error("Error deactivating Operation Type:", error);
        setPopupMessage("Error deactivating Operation Type.");
      }
    });
  };
  
  const handleCancelDeactivate = () => {
    setConfirmDeactivate(null); // Cancela a desativação
  };

  useEffect(() => {
    fetchOperationsTypes();
  }, [currentPage, showActive, showInactive]);

  const handleAddOperationType = () => {
    console.log("Add new Operation Type");
    fetchSpecializations();
    const newOperationTypeDTO = {
      name: "",
      requiredStaff: 0,
      preparationTime: 0,
      surgeryTime: 0,
      cleaningTime: 0,
      totalDuration: 0,
      specialization: "",
      active: true
    };
    console.log("New Operation Type:", newOperationTypeDTO);

    setCreatingOperationType(newOperationTypeDTO);
    setIsModalVisible(true);
  };

  const saveOperationType = async () => {
    if (!creatingOperationType) {
      return;
    }

    let dto;
    const isEdit = !!creatingOperationType.id;

    if (isEdit) {
      const opTypeToEdit = OTypes.find((opType) => opType.id === creatingOperationType.id);

      dto = buildUpdateDto(opTypeToEdit);

      if (dto) {
        console.log("Updating Operation Type:", dto);

        setAlertMessage("Updating...");
        await operationTypeService.updateOperationType(dto);
        setAlertMessage(null);
      } else {
        setPopupMessage("No changes detected.");
      }
    }
    else
    {
      try {
        console.log("Saving Operation Type:", creatingOperationType);
        await operationTypeService.addOperationType(creatingOperationType);
        setPopupMessage("Operation Type created successfully.");
        setIsModalVisible(false);
        fetchOperationsTypes();
      } catch (error) {
        console.error("Error creating Operation Type:", error);
        setPopupMessage("Error creating Operation Type.");
      }
    } 
  }

  const buildUpdateDto = (opTypeToEdit: any) => {
    const updateDto: any = { id: opTypeToEdit.id };

    console.log("Editing Operation Type:", updateDto);


    if (opTypeToEdit.name !== opTypeToEdit.firstName) {
      updateDto.name = creatingOperationType;
    }

    if (creatingOperationType.preparationTime !== opTypeToEdit.preparationTime) {
      updateDto.preparationTime = creatingOperationType.preparationTime;
    }

    if (creatingOperationType.surgeryTime !== opTypeToEdit.surgeryTime) {
      updateDto.surgeryTime = creatingOperationType.surgeryTime;
    }

    if (creatingOperationType.cleaningTime !== opTypeToEdit.cleaningTime) {
      updateDto.cleaningTime = creatingOperationType.cleaningTime;
    }

    if (creatingOperationType.requiredStaff !== opTypeToEdit.requiredStaff) {
      updateDto.requiredStaff = creatingOperationType.requiredStaff;
    }

    if (creatingOperationType.specialization !== opTypeToEdit.specialization) {
      updateDto.specialization = creatingOperationType.specialization;
    }

    return Object.keys(updateDto).length > 1 ? updateDto : null;
  };

  const fetchSpecializations = async () => {
    try {
      const specializations = await specializationsService.getSpecializations();
      console.log("Specializations:", specializations);
      console.log("AQUI OK");
      setSpecializations(specializations);
      console.log("SAME");
    } catch (error) {
      console.error("Error fetching specializations:", error);
    }
  };

  const searchOperationTypes = async (query: Record<string, string>) => {
    setLoading(true);
    setError(null);
    setNoDataMessage(null);
    setOTypes([]);
    try {
      console.log("Query:", query);
      const operationTypeData = await operationTypeService.searchOperationTypes(query);
      console.log("Data returned from searchOperationTypes:", operationTypeData);
  
      const filteredData = operationTypeData.map((operationType) => ({
        id: operationType.id,
        Name: operationType.name.description,
        "Required Staff": operationType.requiredStaff.requiredNumber,
        "Preparation Time": operationType.duration.preparationPhase,
        "Surgery Time": operationType.duration.surgeryPhase,
        "Cleaning Time": operationType.duration.cleaningPhase,
        "Total Time": operationType.duration.totalDuration,
        Specialization: operationType.specialization.value,
        Active: operationType.active ? "Yes" : "No",
      }));
  
      if (filteredData.length === 0) {
        setNoDataMessage("No data found for the requirements.");
      }
      setOTypes(filteredData);
    } catch (error) {
      setError("No data found for the requirements.");
      console.error("Error fetching operation types:", error);
      setAlertMessage("No data found for the requirements.");
      setOTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationsTypes();
  }, [currentPage, showActive, showInactive]);

  return {
    OTypes,
    loading,
    error,
    headers,
    menuOptions,
    totalOTypes,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    isModalVisible,
    setIsModalVisible,
    handleDeactivate,
    handleEdit,
    handleAddOperationType,
    creatingOperationType,
    setCreatingOperationType,
    saveOperationType,
    specializations,
    showActive,
    setShowActive,
    showInactive,
    setShowInactive,
    popupMessage,
    setPopupMessage,
    confirmDeactivate,
    setConfirmDeactivate,
    handleCancelDeactivate,
    searchOperationTypes,
  };

};