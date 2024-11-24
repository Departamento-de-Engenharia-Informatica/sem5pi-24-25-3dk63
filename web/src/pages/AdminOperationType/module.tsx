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


  const itemsPerPage = 5;

  const headers = [
    "Name",
    "Preparation Time",
    "Surgery Time",
    "Cleaning Time",
    "Total Time",
    "Specialization and Required Staff",
    "Total Staff",
    "Active",

  ];

  const menuOptions = [
    {
      label: "Patients",
      action: () => navigate("/admin/patient")
    },
    {
      label: "Staff",
      action: () => navigate("/admin/staff")
    },

    {
      label: "Operation Types",
      action: () => navigate("/admin/operation-type")
    }
  ];

  const fetchOperationsTypes = async () => {
      setLoading(true);
      setError(null);
      try {
        const opsTypedata = await operationTypeService.getOperationTypes();
        setTotalOTypes(opsTypedata.length);

        const filteredData = opsTypedata
          .filter((OperationType) => {
            if (showActive && showInactive) return true;
            else if (showActive) return OperationType.active;
            else if (showInactive) return !OperationType.active;
            return false;
          })
          .map((OperationType) => {
            // Criar arrays de especialização e staff requerido
            const specializations = OperationType.specialization?.value.split(',').map((s: string) => s.trim());
            const requiredStaff = String(OperationType.requiredStaff).split(',').map(s => s.trim());
            const totalStaff = requiredStaff.reduce((acc, curr) => acc + parseInt(curr), 0);
            const specializationAndStaff = specializations.map((spec: any, index: any) => {
              const staff = requiredStaff[index] || "N/A"; // "N/A" se faltar staff para a especialização
              return `${spec} (${staff})`;
            }).join(', ');

            return {
              id: OperationType.id,
              Name: OperationType.name.description,
              "Preparation Time": OperationType.duration.preparationPhase,
              "Surgery Time": OperationType.duration.surgeryPhase,
              "Cleaning Time": OperationType.duration.cleaningPhase,
              "Total Time": OperationType.duration.totalDuration,
              "Specialization and Required Staff": specializationAndStaff,
              Active: OperationType.active ? "Yes" : "No",
              "Total Staff": totalStaff,
              specializationsList: specializations,
              requiredStaffList: requiredStaff
            };
          });

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedOperationTypes = filteredData.slice(startIndex, startIndex + itemsPerPage);
        setOTypes(paginatedOperationTypes);
      } catch (error: any) {
        console.error( "Error searching operation types:", error);

        // Captura a mensagem específica do backend, se existir
        const errorMessage = error?.response?.data?.message ||
                            error?.message ||
                            "An unknown error occurred.";
        setPopupMessage("Error fetching operation types: " + errorMessage);
    } finally {
        setLoading(false);
      }
    };

  const handleEdit = async (id: string) => {
    fetchSpecializations();
    const opTypeToEdit = OTypes.find((opType) => opType.id === id && opType.Active === 'Yes');

    if (!opTypeToEdit || opTypeToEdit.Active === 'No')
    {
      setPopupMessage("Operation type needs to be active to be edited!");
      return;
    }

    console.log("Editing Operation Type: ", opTypeToEdit);

    try{
      if (opTypeToEdit) {
        setCreatingOperationType({
          id: opTypeToEdit.id,
          name: opTypeToEdit.Name,
          requiredStaff: opTypeToEdit.requiredStaffList || [],
          preparation: opTypeToEdit["Preparation Time"],
          surgery: opTypeToEdit["Surgery Time"],
          cleaning: opTypeToEdit["Cleaning Time"],
          totalDuration: opTypeToEdit["Total Time"],
          specialities: opTypeToEdit.specializationsList || [],
          showSpecializationDropdown: false,
        });

      setIsModalVisible(true);
    }
  } catch (error: any) {
    console.error("Error editing Operation Type:", error);
    const errorMessage = error?.response?.data?.message ||
                        error?.message ||
                        "An unknown error occurred.";
    setPopupMessage(errorMessage);
  }};


  const handleDeactivate = (id: string) => {
    // Exibe o modal de confirmação
    setConfirmDeactivate(() => async () => {
      try {
        console.log("Deactivating Operation Type with id:", id);
        await operationTypeService.deactivateOperationType(id);
        fetchOperationsTypes();
        setPopupMessage("Operation Type deactivated successfully.");
      } catch (error:any ) {
        console.error("Error deactivating Operation Type:", error);
        const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
        setPopupMessage(errorMessage);
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
      preparation: 0,
      surgery: 0,
      cleaning: 0,
      totalDuration: 0,
      specialization: [],
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

    try {
      if (isEdit) {
        const opTypeToEdit = OTypes.find((opType) => opType.id === creatingOperationType.id);

        dto = buildUpdateDto(opTypeToEdit);

        if (dto) {
          console.log("Updating Operation Type:", dto);

          await operationTypeService.updateOperationType(opTypeToEdit.id, dto);
          setPopupMessage("Operation Type updated successfully.");
          setIsModalVisible(false);
          fetchOperationsTypes();
        } else {
          setPopupMessage("No changes detected.");
        }
      }
      else
      {
        console.log("Saving Operation Type:", creatingOperationType);
        await operationTypeService.addOperationType(creatingOperationType);
        setPopupMessage("Operation Type created successfully.");
        setIsModalVisible(false);
        fetchOperationsTypes();
      }

    } catch (error: any) {
      console.error(isEdit ? "Error updating operation type:" : "Error creating Operation Type:", error);

      // Captura a mensagem específica do backend, se existir
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
    }
  }

  const buildUpdateDto = (opTypeToEdit: any) => {
    const updateDto: any = { id: opTypeToEdit.id };

    console.log("Editing Operation Type:", updateDto);

    const isEqual = (val1: any, val2: any): boolean => {
      if (Array.isArray(val1) && Array.isArray(val2)) {
          return val1.length === val2.length && val1.every((item, index) => isEqual(item, val2[index]));
      }
      return String(val1).trim().toLowerCase() === String(val2).trim().toLowerCase();
    };

    if (!isEqual(creatingOperationType.name, opTypeToEdit.Name)) {
        updateDto.name = creatingOperationType.name;
    }

    if (!isEqual(creatingOperationType.preparation, opTypeToEdit["Preparation Time"])) {
        updateDto.preparation = creatingOperationType.preparation;
    }

    if (!isEqual(creatingOperationType.surgery, opTypeToEdit["Surgery Time"])) {
        updateDto.surgery = creatingOperationType.surgery;
    }

    if (!isEqual(creatingOperationType.cleaning, opTypeToEdit["Cleaning Time"])) {
        updateDto.cleaning = creatingOperationType.cleaning;
    }

    if (!isEqual(creatingOperationType.specialities, opTypeToEdit.specializationsList)) {
      updateDto.specializations = creatingOperationType.specialities;
    }

    if (!isEqual(creatingOperationType.requiredStaff, opTypeToEdit.requiredStaffList)) {
        updateDto.requiredStaff = creatingOperationType.requiredStaff;
    }

    return Object.keys(updateDto).length > 1 ? updateDto : null;
  };


  const fetchSpecializations = async () => {
    try {
      const specializations = await specializationsService.getSpecializations();
      console.log("Specializations:", specializations);
      setSpecializations(specializations);
    } catch (error: any) {
      console.error("Error fetching specializations:", error);
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
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
  
      // Apply the same transformation logic as in fetchOperationsTypes
      const filteredData = operationTypeData
        .filter((OperationType) => {
          if (showActive && showInactive) return true;
          else if (showActive) return OperationType.active;
          else if (showInactive) return !OperationType.active;
          return false;
        })
        .map((OperationType) => {
          const specializations = OperationType.specialization?.value.split(',').map((s: string) => s.trim());
          const requiredStaff = String(OperationType.requiredStaff).split(',').map(s => s.trim());
          const totalStaff = requiredStaff.reduce((acc, curr) => acc + parseInt(curr), 0);
          const specializationAndStaff = specializations.map((spec: any, index: any) => {
            const staff = requiredStaff[index] || "N/A";
            return `${spec} (${staff})`;
          }).join(', ');
  
          return {
            id: OperationType.id,
            Name: OperationType.name.description,
            "Preparation Time": OperationType.duration.preparationPhase,
            "Surgery Time": OperationType.duration.surgeryPhase,
            "Cleaning Time": OperationType.duration.cleaningPhase,
            "Total Time": OperationType.duration.totalDuration,
            "Specialization and Required Staff": specializationAndStaff,
            Active: OperationType.active ? "Yes" : "No",
            "Total Staff": totalStaff,
            specializationsList: specializations,
            requiredStaffList: requiredStaff,
          };
        });
  
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedOperationTypes = filteredData.slice(startIndex, startIndex + itemsPerPage);
  
      if (filteredData.length === 0) {
        setNoDataMessage("No data found for the requirements.");
      }
      setOTypes(paginatedOperationTypes);
    } catch (error: any) {
      console.error("Error searching operation types:", error);
      setError("Error searching operation types.");
      const errorMessage = error?.response?.data?.message || error?.message || "An unknown error occurred.";
      setPopupMessage(errorMessage);
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