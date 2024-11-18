import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IPatientService } from "@/service/IService/IPatientService";

export const useConfirmDeletionModule = () => {
  const patientService = useInjection<IPatientService>(TYPES.patientService);
  const location = useLocation();

  const [confirmationStatus, setConfirmationStatus] = useState<string>("Processing confirmation...");

  const confirmDeletion = async (token: string | null) => {
    if (!token) {
      setConfirmationStatus("Invalid token. Please request another deletion.");
      return;
    }
  
    const response = await patientService.confirmDeletion(token);
    setConfirmationStatus(response);

  };
  

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    confirmDeletion(token);
  }, [location.search]);

  return { confirmationStatus };
};
