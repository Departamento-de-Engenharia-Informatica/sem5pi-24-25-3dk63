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

  const itemsPerPage = 10;

  const headers = ["Record ID", "Patient Name", "Date", "Notes"];

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
    { label: "Patient", action: () => navigate("/patient") },
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
    } catch (error) {
      setError("Error fetching medical records.");
      setAlertMessage("Error fetching medical records.");
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
  };
};