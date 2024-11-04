import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IAppointmentService } from "../../service/IService/IAppointmentService";
import { useNavigate } from "react-router-dom";

export const useAppointmentsListModule = (
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const navigate = useNavigate();
  const appointmentsService = useInjection<IAppointmentService>(TYPES.appointmentService);

  const [Appointments, setAppointments] = useState<any[]>([]);
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
    setLoading(true);
    setError(null);
    try {
      const AppointmentsData = await appointmentsService.getAppointments();
      setTotalAppointments(AppointmentsData.length);

      const filteredData = AppointmentsData.filter((appointment) => {
        // Filter based on active and inactive checkboxes
        if (showActive && showInactive) return true; // Show all
        if (showActive) return appointment.active;
        if (showInactive) return !appointment.active;
        return false;
      }).map((appointment) => ({
        Date: appointment.date,
        Hour: appointment.hour,
        Room: appointment.room,
        Active: appointment.active ? "Yes" : "No",
      }));

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedAppointments = filteredData.slice(startIndex, startIndex + itemsPerPage);
      setAppointments(paginatedAppointments);
    } catch (error) {
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
    Appointments,
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
