import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IPatientService } from "@/service/IService/IPatientService";
import { useNavigate } from "react-router-dom";
import { PatientUser } from "@/model/PatientUser";

export const useAppointmentsListModule = (
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const navigate = useNavigate();
  const patientService = useInjection<IPatientService>(TYPES.patientService);

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalAppointments, setTotalAppointments] = useState<number>(0);
  const [showActive, setShowActive] = useState<boolean>(true);
  const [showInactive, setShowInactive] = useState<boolean>(true);

  const itemsPerPage = 10;
  const headers = ["Date", "Hour", "Room", "Active"];
  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
    { label: "Patient", action: () => navigate("/patient") },
  ];

  const fetchAppointments = async () => {
    console.log("Fetching appointments...");
    setLoading(true);
    setError(null);

    try {
      const patientsData: PatientUser[] = await patientService.getAppointments();
      console.log("Data received from service:", patientsData);
      setTotalAppointments(patientsData.length);

      const filteredData = patientsData
        .flatMap((patient) => patient.appointmentHistoryList)
        .filter((appointment) => {
          if (showActive && showInactive) return true;
          if (showActive) return appointment.active;
          if (showInactive) return !appointment.active;
          return false;
        })
        .map((appointment) => ({
          Date: appointment.date,
          Hour: appointment.hour,
          Room: appointment.room,
          Active: appointment.active ? "Yes" : "No",
        }));

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedAppointments = filteredData.slice(startIndex, startIndex + itemsPerPage);
      setAppointments(paginatedAppointments);

      if (paginatedAppointments.length === 0) {
        console.log("No appointments found for current filter and page.");
      } else {
        console.log("Appointments found:", paginatedAppointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Error fetching appointments.");
      setAlertMessage("Error fetching appointments.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts or dependencies change
  useEffect(() => {
    fetchAppointments();
  }, [currentPage, showActive, showInactive]);

  return {
    appointments,
    loading,
    error,
    headers,
    menuOptions,
    totalAppointments,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    showActive,
    setShowActive,
    showInactive,
    setShowInactive,
  };
};