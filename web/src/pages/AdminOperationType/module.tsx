import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IOperationTypeService } from "@/service/IService/IOperationTypeService";
import { useNavigate } from "react-router-dom";

export const useOperationTypeListModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const navigate = useNavigate();
  const operationTypeService = useInjection<IOperationTypeService>(TYPES.staffService);

  const [OTypes, setOTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalOTypes, setTotalOTypes] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [staffToEdit, setStaffToEdit] = useState<any | null>(null); 

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
      const opsTypedata = await operationTypeService.getOperationTypes();
      setTotalOTypes(opsTypedata.length);
      const filteredData = opsTypedata.map((OperationType) => ({
        "Nome": OperationType.name,
        "Required Staff": OperationType.requiredStaff,
        "Preparation Time": OperationType.preparationTime,
        "Surgery Time": OperationType.surgeryTime,
        "Cleaning Time": OperationType.cleaningTime,
        "Total Time": OperationType.totalTime,
        "Specialization": OperationType.specialization,
        Ativo: OperationType.active ? "Sim" : "Não",
        Ações: (
          <div>
            <button onClick={() => handleDeactivate(staffUser.licenseNumber)}>Desativar</button>
          </div>
        ),
      }));

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedStaffs = filteredData.slice(startIndex, startIndex + itemsPerPage);
      setTotalOTypes(paginatedStaffs);
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
    staffToEdit,
    setStaffToEdit,
  };
};
