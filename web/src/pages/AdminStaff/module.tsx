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
  const itemsPerPage = 1;

  const headers = [
    "License Number",
    "Username",
    "Role",
    "Email",
    "Nome Completo",
    "Specialization Description",
    "Availability Slots",
    "Ativo",
  ];

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
    { label: "AdminMenu", action: () => navigate("/admin") },
  ];

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const staffsData = await staffService.getStaffs();
      setTotalStaffs(staffsData.length); // Armazena o total de staffs
      const filteredData = staffsData.map((staffUser) => ({
        "License Number": staffUser.licenseNumber,
        Username: staffUser.username,
        Role: staffUser.role,
        Email: staffUser.email,
        "Nome Completo": staffUser.name,
        "Specialization Description": staffUser.specializationDescription,
        "Availability Slots": staffUser.availabilitySlots,
        Ativo: staffUser.active ? "Sim" : "Não",
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

  useEffect(() => {
    fetchStaffs();
  }, [currentPage]); 

  return { staffs, loading, error, headers, menuOptions, totalStaffs, currentPage, setCurrentPage, itemsPerPage };
};
