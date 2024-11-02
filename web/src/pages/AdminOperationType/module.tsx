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

  const fetchStaffs = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("OIIIII");
      const opsTypedata = await operationTypeService.getOperationTypes();
      console.log("OIIIII222");
      setTotalOTypes(opsTypedata.length);
      console.log("OIIIII222");
      const filteredData = opsTypedata.map((OperationType) => ({
        "Nome": OperationType.name.description,
        "Required Staff": OperationType.requiredStaff.requiredNumber,
        "Preparation Time": OperationType.duration.preparationPhase,
        "Surgery Time": OperationType.duration.surgeryPhase,
        "Cleaning Time": OperationType.duration.cleaningPhase,
        "Total Time": OperationType.duration.totalDuration,
        "Specialization": OperationType.specialization,
        Ativo: OperationType.active ? "Sim" : "Não",
      }));

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

  ;

  useEffect(() => {
    fetchStaffs();
  }, [currentPage]);

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
  };
};
