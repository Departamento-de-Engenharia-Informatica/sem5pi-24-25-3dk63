import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IPatientService } from "@/service/IService/IPatientService";

export const useConfirmDeletionModule = () => {
  const patientService = useInjection<IPatientService>(TYPES.patientService);
  const location = useLocation();

  const [confirmationStatus, setConfirmationStatus] = useState<string>("Processing confirmation...");
  const [loading, setLoading] = useState<boolean>(true);

  const confirmDeletion = async (token: string) => {
    if (!token) {
      setConfirmationStatus("Token not found. Please request another deletion.");
      setLoading(false);
      return;
    }

    try {
      const response = await patientService.confirmDeletion(token);
      setConfirmationStatus(response);
    } catch (error: any) {
      console.error("Deletion error:", error);
      setConfirmationStatus(
        error?.response?.data?.error ||
        error?.message ||
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
    
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
  
    setLoading(true);
    if (token) {
      confirmDeletion(token);
    } else {
      setConfirmationStatus("Token not found. Please request another deletion.");
      setLoading(false);
    }
  }, [location.search]);

  return { confirmationStatus, loading };
}
