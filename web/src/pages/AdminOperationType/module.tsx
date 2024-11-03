import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IOperationTypeService } from "@/service/IService/IOperationTypeService";
import { useNavigate } from "react-router-dom";
import { CreatingOperationTypeDTO } from "@/dto/CreatingOperationTypeDTO";

export const useOpTypesListModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const navigate = useNavigate();
  const operationTypeService = useInjection<IOperationTypeService>(TYPES.operationTypeService);

  const [OTypes, setOTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalOTypes, setTotalOTypes] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [creatingOperationType, setCreatingOperationType] = useState<any | null>(null);

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
      console.log("Data returned from getOperationTypes:", opsTypedata);
      setTotalOTypes(opsTypedata.length);
      const filteredData = opsTypedata.map((OperationType) => ({
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

      console.log("Filtered Data:", filteredData);

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

  const handleDeactivate = async (id: string) => {
    if (window.confirm("Are you sure you want to deactivate this operation type?")) {
      console.log("Deactivating Operation Type with id:", id);
      try {
        await operationTypeService.deactivateOperationType(id);
        fetchOperationsTypes();
        setAlertMessage("Operation Type deactivated successfully.");
        window.confirm("Operation Type deactivated successfully. Action logged.");
      } catch (error) {
        console.error("Error deactivating Operation Type:", error);
        setAlertMessage("Error deactivating Operation Type.");
      }
    }
  };

  useEffect(() => {
    fetchOperationsTypes();
  }, [currentPage]);

  const handleAddOperationType = () => {
    console.log("Add new Operation Type");
    const newOperationTypeDTO = {
      name: "",
      requiredStaff: 0,
      preparationTime: 0,
      surgeryTime: 0,
      cleaningTime: 0,
      specialization: "",
      active: true,
    };
    console.log("New Operation Type:", newOperationTypeDTO);

    setCreatingOperationType(newOperationTypeDTO);
    setIsModalVisible(true);
  };

  const saveOperationType = async () => {
    if (!creatingOperationType) {
      return;
    }
    try {
      console.log("Saving Operation Type:", creatingOperationType);
      await operationTypeService.addOperationType(creatingOperationType);
      window.confirm("Operation Type created successfully.");
      setIsModalVisible(false);
      fetchOperationsTypes();
    } catch (error) {
      console.error("Error creating Operation Type:", error);
      window.confirm("Error creating Operation Type.");
    }
  };

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
    handleAddOperationType,
    creatingOperationType,
    setCreatingOperationType,
    saveOperationType,
  };
};
