import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IStaffService } from "@/service/IService/IStaffService";
import { useNavigate } from "react-router-dom";

export const useStaffListModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const navigate = useNavigate();
  const staffService = useInjection<IStaffService>(TYPES.staffService);

  const [staffs, setStaffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalStaffs, setTotalStaffs] = useState<number>(0);
  const itemsPerPage = 10;

  const headers = [
    "License Number",
    "Username",
    "Role",
    "Email",
    "Telefone",
    "Nome Completo",
    "Specialization Description",
    "Availability Slots",
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
      const staffsData = await staffService.getStaffs();
      setTotalStaffs(staffsData.length);
      const filteredData = staffsData.map((staffUser) => ({
        "License Number": staffUser.licenseNumber,
        Username: staffUser.username,
        Role: staffUser.role,
        Email: staffUser.email,
        "Telefone": staffUser.phoneNumber,
        "Nome Completo": staffUser.name,
        "Specialization Description": staffUser.specializationDescription,
        "Availability Slots": staffUser.availabilitySlots,
        Ativo: staffUser.active ? "Sim" : "Não",
        Ações: (
          <div>
            <button onClick={() => handleEdit(staffUser.licenseNumber)}>Editar</button>
            <button onClick={() => handleDeactivate(staffUser.licenseNumber)}>Desativar</button>
          </div>
        ),
        id: staffUser.licenseNumber,
      }));

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedStaffs = filteredData.slice(startIndex, startIndex + itemsPerPage);
      setStaffs(paginatedStaffs);
    } catch (error) {
      setError("Erro ao buscar staffs.");
      setAlertMessage("Erro ao buscar staffs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este membro da equipe?")) {
      try {
        await staffService.deleteStaff(id);
        setStaffs((prev) => prev.filter((staff) => staff.id !== id));
        setAlertMessage("Membro da equipe excluído com sucesso.");
      } catch (error) {
        console.error("Erro ao excluir membro da equipe:", error);
        setAlertMessage("Erro ao excluir membro da equipe.");
      }
    }
  };

  const handleEdit = (id: string) => {
    // Navigate to edit page or open edit modal
    navigate(`/staff/edit/${id}`);
  };

  const handleDeactivate = async (id: string) => {
    if (window.confirm("Tem a certeza que deseja desativar este staff?")) {
      try {
        await staffService.deactivateStaff(id);
        fetchStaffs(); // Refresh the list after deactivation
        setAlertMessage("Staff desativado com sucesso.");
      } catch (error) {
        console.error("Erro ao desativar staff:", error);
        setAlertMessage("Erro ao desativar staff.");
      }
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, [currentPage]);

  return {
    staffs,
    loading,
    error,
    headers,
    menuOptions,
    totalStaffs,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleDelete
  };
};
