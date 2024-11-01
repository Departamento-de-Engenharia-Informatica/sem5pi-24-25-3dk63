// module.tsx
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


  const headers = [
    "Medical Record Number",
    "Nome Completo",
    "Email Pessoal",
    "Email IAM",
    "Data de Nascimento",
    "Sexo",
    "Telefone de Contato",
    "Ativo"
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
      const filteredData = patientsData.map((patientUser) => ({
        "Medical Record Number": patientUser.id.value,
        "Nome Completo": `${patientUser.name.firstName} ${patientUser.name.lastName}`,
        "Email Pessoal": patientUser.personalEmail.value,
        "Email IAM": patientUser.iamEmail.value,
        "Data de Nascimento": patientUser.dateOfBirth.date,
        Sexo: patientUser.gender.gender,
        "Telefone de Contato": patientUser.phoneNumber.number,
        Ativo: patientUser.active ? "Sim" : "Não",
      }));

      setPatients(filteredData);
    } catch (error) {
      setError("Erro ao buscar pacientes.");
      console.error("Erro ao buscar pacientes:", error);
      setAlertMessage("Erro ao buscar pacientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return { patients, loading, error, headers, menuOptions };
};
