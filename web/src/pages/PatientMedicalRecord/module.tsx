import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IPatientService } from "@/service/IService/IPatientService";
import { useNavigate } from "react-router-dom";
import { PatientUser } from "@/model/PatientUser";

export const useMedicalRecordsListModule = (
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const navigate = useNavigate();
  const patientService = useInjection<IPatientService>(TYPES.patientService);

  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalMedicalRecords, setTotalMedicalRecords] = useState<number>(0);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const itemsPerPage = 10;

  const headers = ["Record ID", "Patient Name", "Date", "Notes"];

  const menuOptions = [
  {
    label: "Appointments",
    action: () => navigate("/patient/appointments")
  },
  {
    label: "Medical Record",
    action: () => navigate("/patient/medical-record")
  },
];
  const fetchMedicalRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const recordsData: PatientUser[] = await patientService.getMedicalRecords();
      setTotalMedicalRecords(recordsData.length);

      const paginatedRecords = recordsData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

      const formattedRecords = paginatedRecords.map((record) => ({
        "Record ID": record.id.value,
        "Patient Name": `${record.name.firstName} ${record.name.lastName}`,
        Date: record.dateOfBirth.date,
        Notes: record.medicalHistory.medicalHistory,
      }));

      setMedicalRecords(formattedRecords);
    } catch (error: any) {
      console.error( "Error searching patients:", error);

      // Captura a mensagem específica do backend, se existir
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
  } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, [currentPage]);

  return {
    medicalRecords,
    loading,
    error,
    headers,
    menuOptions,
    totalMedicalRecords,
    currentPage,
    setCurrentPage,
    itemsPerPage,
        popupMessage,

  };
};
