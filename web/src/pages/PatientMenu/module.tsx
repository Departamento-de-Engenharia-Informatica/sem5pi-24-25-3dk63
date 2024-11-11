import React from "react";
import { useNavigate } from "react-router-dom";
import { PatientService } from "@/service/patientService";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";

export const usePatientMenuModule = () => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [isDeletionRequested, setIsDeletionRequested] = React.useState(false);
  const patientService = useInjection<PatientService>(TYPES.patientService);

  // Navigation handlers
  const handleAppointments = () => {
    navigate("/patient/appointments");
  };

  const handleMedicalRecords = () => {
    navigate("/patient/medical-record");
  };

  const handleAccountDeletionRequest = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await patientService.requestAccountDeletion();
      setAlertMessage("Account deletion requested. Please check your email to confirm.");
      setIsDeletionRequested(true);
    } catch (error) {
      setAlertMessage("Failed to request account deletion.");
    } finally {
      setLoading(false);
    }
  };

  return {
    alertMessage,
    loading,
    isDeletionRequested,
    handleAppointments,
    handleMedicalRecords,
    handleAccountDeletionRequest,
  };
};
