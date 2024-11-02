import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IOperationTypeService } from "@/service/IService/IOperationTypeService";
import { useNavigate } from "react-router-dom";

export const useOpTypesListModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const navigate = useNavigate();
  const operationTypeService = useInjection<IOperationTypeService>(TYPES.operationTypeService);

  const [OTypes, setOTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalOTypes, setTotalOTypes] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    // Aqui você pode implementar a lógica para adicionar um novo tipo de operação
    // Por exemplo, abrir um modal ou redirecionar para uma página de criação
    // faz para mostrar alguma coisa
    setIsModalVisible(true);
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
  };
};
