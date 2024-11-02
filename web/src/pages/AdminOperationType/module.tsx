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
    "Nome",
    "Required Staff",
    "Preparation Time",
    "Surgery Time",
    "Cleaning Time",
    "Total Time",
    "Specialization",
    "Ativo",
    "Ações",
  ];

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
    { label: "AdminMenu", action: () => navigate("/admin") },
  ];

  const fetchOperationsTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const opsTypedata = await operationTypeService.getOperationTypes();
      console.log("Dados retornados do getOperationTypes:", opsTypedata);
      setTotalOTypes(opsTypedata.length);
      const filteredData = opsTypedata.map((OperationType) => ({
        id: OperationType.id,
        Nome: OperationType.name.description,
        "Required Staff": OperationType.requiredStaff.requiredNumber,
        "Preparation Time": OperationType.duration.preparationPhase,
        "Surgery Time": OperationType.duration.surgeryPhase,
        "Cleaning Time": OperationType.duration.cleaningPhase,
        "Total Time": OperationType.duration.totalDuration,
        Specialization: OperationType.specialization.value,
        Ativo: OperationType.active ? "Sim" : "Não",
      }));

      console.log("Dados filtrados:", filteredData);

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedOperationTypes = filteredData.slice(startIndex, startIndex + itemsPerPage);
      setOTypes(paginatedOperationTypes);
    } catch (error) {
      setError("Erro ao listar tipos de operação.");
      setAlertMessage("Erro ao listar tipos de operação.");
    } finally {
      setLoading(false);
    }
  };

    const handleDeactivate = async (id: string) => {
    if (window.confirm("Tem a certeza que deseja desativar este operation type?")) {
      console.log("Desativar Operation Type com id:", id);
      try {
        await operationTypeService.deactivateOperationType(id);
        fetchOperationsTypes();
        setAlertMessage("Operation Type desativado com sucesso.");
        window.confirm("Operation Type desativado com sucesso. Ação registada no log.");
      } catch (error) {
        console.error("Erro ao desativar Operation Type:", error);
        setAlertMessage("Erro ao desativar Operation Type.");
      }
    }
  }

  useEffect(() => {
    fetchOperationsTypes();
  }, [currentPage]);


    const handleAddOperationType = () => {
      console.log("Adicionar novo Tipo de Operação");
      const newOperationTypeDTO = {
        name: "",
        requiredStaff: 0,
        preparationTime: 0,
        surgeryTime: 0,
        cleaningTime: 0,
        specialization: "",
        active: true,
      };
      console.log("Novo Tipo de Operação:", newOperationTypeDTO);

    setCreatingOperationType(newOperationTypeDTO);
    setIsModalVisible(true);
  };

  const saveOperationType = async () => {
    if (!creatingOperationType) {
      return;
    }
    try {
      console.log("Salvando Tipo de Operação:", creatingOperationType);
      await operationTypeService.addOperationType(creatingOperationType);
       window.confirm("Tipo de Operação criado com sucesso.");
      setIsModalVisible(false);
      fetchOperationsTypes();
    } catch (BusinessRuleValidationException) {
      console.error("Erro ao criar Tipo de Operação:", error);
       window.confirm("Erro ao criar Tipo de Operação.");
    }
  }


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
  

