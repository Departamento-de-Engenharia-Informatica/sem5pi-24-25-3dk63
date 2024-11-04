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
    "Full Name",
    "Personal Email",
    "IAM Email",
    "Date of Birth",
    "Gender",
    "Contact Phone",
    "Active",
    "",
  ];

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
    { label: "Admin Menu", action: () => navigate("/admin") },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-CA"); 
  };

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const patientsData = await patientService.getPatients();
      console.log("Data returned from getPatients:", patientsData);
      setTotalPatients(patientsData.length);

      const filteredData = patientsData.map((patientUser) => ({
        "Medical Record Number": patientUser.id.value,
        "Full Name": `${patientUser.name.firstName} ${patientUser.name.lastName}`,
        "Personal Email": patientUser.personalEmail.value,
        "IAM Email": patientUser.iamEmail.value,
        "Date of Birth": formatDate(patientUser.dateOfBirth.date),
        Gender: patientUser.gender.gender,
        "Contact Phone": patientUser.phoneNumber.number,
        Active: patientUser.active ? "Yes" : "No",
        id: patientUser.id.value,
      }));

      console.log("Filtered data:", filteredData);

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedPatients = filteredData.slice(startIndex, startIndex + itemsPerPage);
      setPatients(paginatedPatients);
    } catch (error) {
      setError("Error fetching patients.");
      setAlertMessage("Error fetching patients.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await patientService.deletePatient(id);
        setPatients((prev) => prev.filter((patient) => patient.id !== id));
        setAlertMessage("Patient deleted successfully.");
      } catch (error) {
        console.error("Error deleting patient:", error);
        setAlertMessage("Error deleting patient.");
      }
    }
  };

  // Search patients
  const searchPatients = async (query: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Query:", query);
      const patientsData = await patientService.searchPatients(query);
      console.log("Data returned from searchPatients:", patientsData);

      const filteredData = patientsData.map((patientUser) => ({
        "Medical Record Number": patientUser.id.value,
        "Full Name": `${patientUser.name.firstName} ${patientUser.name.lastName}`,
        "Personal Email": patientUser.personalEmail.value,
        "IAM Email": patientUser.iamEmail.value,
        "Date of Birth": formatDate(patientUser.dateOfBirth.date),
        Gender: patientUser.gender.gender,
        "Contact Phone": patientUser.phoneNumber.number,
        Active: patientUser.active ? "Yes" : "No",
        id: patientUser.id.value,
      }));
      setPatients(filteredData);
    } catch (error) {
      setError("Error fetching staff.");
      console.error("Error fetching staff:", error);
      setAlertMessage("Error fetching staff.");
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
