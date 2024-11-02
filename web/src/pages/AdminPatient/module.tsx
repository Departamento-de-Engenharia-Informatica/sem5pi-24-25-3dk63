import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IPatientService } from "@/service/IService/IPatientService";
import { useNavigate } from "react-router-dom";

export const usePatientListModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const navigate = useNavigate();
  const patientService = useInjection<IPatientService>(TYPES.patientService);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPatients, setTotalPatients] = useState<number>(0);


  const itemsPerPage = 10;


  const headers = [
    "Medical Record Number",
    "Nome Completo",
    "Email Pessoal",
    "Email IAM",
    "Data de Nascimento",
    "Sexo",
    "Telefone de Contato",
    "Ativo",
    "",
  ];

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
    { label: "AdminMenu", action: () => navigate("/admin") },
  ];

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const patientsData = await patientService.getPatients();
      console.log("Dados retornados do getPatients:", patientsData);
      setTotalPatients(patientsData.length);
      const filteredData = patientsData.map((patientUser) => ({
        "Medical Record Number": patientUser.id.value,
        "Nome Completo": `${patientUser.name.firstName} ${patientUser.name.lastName}`,
        "Email Pessoal": patientUser.personalEmail.value,
        "Email IAM": patientUser.iamEmail.value,
        "Data de Nascimento": patientUser.dateOfBirth.date,
        Sexo: patientUser.gender.gender,
        "Telefone de Contato": patientUser.phoneNumber.number,
        Ativo: patientUser.active ? "Sim" : "Não",
        id: patientUser.id.value,
      }));

      console.log("Dados filtrados:", filteredData);

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedPatients = filteredData.slice(startIndex, startIndex + itemsPerPage);
      setPatients(paginatedPatients);
    } catch (error) {
      setError("Erro ao buscar pacientes.");
      setAlertMessage("Erro ao buscar pacientes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este paciente?")) {
      try {
        await patientService.deletePatient(id);
        setPatients((prev) => prev.filter((patient) => patient.id !== id));
        setAlertMessage("Paciente excluído com sucesso.");
      } catch (error) {
        console.error("Erro ao excluir paciente:", error);
        setAlertMessage("Erro ao excluir paciente.");
      }
    }
  };

      //search staff
const searchPatients = async (query: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Query:", query);
      const patientsData = await patientService.searchPatients(query);
      console.log("Dados retornados do searchPatients:", patientsData);

     const filteredData = patientsData.map((patientUser) => ({
        "Medical Record Number": patientUser.id.value,
        "Nome Completo": `${patientUser.name.firstName} ${patientUser.name.lastName}`,
        "Email Pessoal": patientUser.personalEmail.value,
        "Email IAM": patientUser.iamEmail.value,
        "Data de Nascimento": patientUser.dateOfBirth.date,
        Sexo: patientUser.gender.gender,
        "Telefone de Contato": patientUser.phoneNumber.number,
        Ativo: patientUser.active ? "Sim" : "Não",
        id: patientUser.id.value,
      }));
      setPatients(filteredData);
    } catch (error) {
      setError("Erro ao buscar staffs.");
      console.error("Erro ao buscar staffs:", error);
      setAlertMessage("Erro ao buscar staffs.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPatients();
  }, [currentPage]);


  return {
    patients,
    loading,
    error,
    headers,
    menuOptions,
    currentPage,
    setCurrentPage,
    handleDelete,
    totalPatients,
    itemsPerPage,
    searchPatients,
  };
};
