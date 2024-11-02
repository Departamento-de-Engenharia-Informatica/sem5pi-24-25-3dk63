import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IStaffService } from "@/service/IService/IStaffService";
import { useNavigate } from "react-router-dom";
import { PendingStaffChangesDTO } from "@/dto/PendingStaffChangesDTO";

export const useStaffListModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const navigate = useNavigate();
  const staffService = useInjection<IStaffService>(TYPES.staffService);

  const [staffs, setStaffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalStaffs, setTotalStaffs] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<any | null>(null);
  const [LicenseStaffToEdit, setLicenseToEdit] = useState<any | null>(null);

  const itemsPerPage = 10;

  const headers = [
    "License Number",
    "Username",
    "Role",
    "Email",
    "Telefone",
    "Nome Completo",
    "Specialization",
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

      console.log("Dados retornados do getStaffs:", staffsData);
      setTotalStaffs(staffsData.length);
      const filteredData = staffsData.map((staffUser) => ({
        "License Number": staffUser.licenseNumber,
        Username: staffUser.username,
        Role: staffUser.role,
        Email: staffUser.email,
        "Telefone": staffUser.phoneNumber,
        "Nome Completo": staffUser.name,
        "Specialization": staffUser.specializationDescription,
        "Availability Slots": staffUser.availabilitySlots,
        Ativo: staffUser.active ? "Sim" : "Não",
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
    if (window.confirm("Tem certeza que deseja excluir este staff?")) {
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

  const handleEdit = async (staff: any) => {
    console.log("Editing staff?/:", staff); // Log do staff a ser editado

    const newStaff = {
      email: {
        value: staff.Email
      },
      phoneNumber: {
        number: staff.Telefone
      },
      specialization: staff.Specialization

    };
    console.log("New staff to edit:", newStaff); // Log do novo staff a ser editado

    setStaffToEdit(newStaff); // Define o staff para edição
    setLicenseToEdit(staff.id); // Define o licenseNumber para edição
    setIsModalVisible(true); // Mostra o modal
  };

  const handleDeactivate = async (id: string) => {
    if (window.confirm("Tem a certeza que deseja desativar este staff?")) {
      try {
        await staffService.deactivateStaff(id);
        fetchStaffs(); // Refresh the list after deactivation
        setAlertMessage("Staff desativado com sucesso.");
        window.confirm("Staff desativado com sucesso. Ação registada no log.");
      } catch (error) {
        console.error("Erro ao desativar staff:", error);
        setAlertMessage("Erro ao desativar staff.");
      }
    }
  }

  const saveChanges = async () => {
    if (staffToEdit) {

        try {
            await staffService.editStaff(LicenseStaffToEdit, staffToEdit); // Aqui você chama com o licenseNumber
            setAlertMessage("Informações do staff atualizadas com sucesso.");
            fetchStaffs(); // Refresh the staff list
        } catch (error) {
            console.error("Erro ao editar informações do staff:", error);
            setAlertMessage("Erro ao editar informações do staff.");
        } finally {
            setIsModalVisible(false); // Close the modal after saving
        }
    }
};


    //search staff
const searchStaffs = async (query: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Query:", query);
      const staffsData = await staffService.searchStaffs(query);
      console.log("Dados retornados do searchPatients:", staffsData);

      const filteredData = staffsData.map(( staffUser) => ({
         "License Number": staffUser.licenseNumber,
        Username: staffUser.username,
        Role: staffUser.role,
        Email: staffUser.email,
        "Telefone": staffUser.phoneNumber,
        "Nome Completo": staffUser.name,
        "Specialization": staffUser.specializationDescription,
        "Availability Slots": staffUser.availabilitySlots,
        Ativo: staffUser.active ? "Sim" : "Não",
      }));

      setStaffs(filteredData);
    } catch (error) {
      setError("Erro ao buscar staffs.");
      console.error("Erro ao buscar staffs:", error);
      setAlertMessage("Erro ao buscar staffs.");
    } finally {
      setLoading(false);
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
    isModalVisible,
    setIsModalVisible,
    handleDelete,
    handleEdit,
    handleDeactivate,
    staffToEdit,
    setStaffToEdit,
    saveChanges,
    searchStaffs,
  };
};
