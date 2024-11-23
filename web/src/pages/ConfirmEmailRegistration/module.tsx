import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IPatientService } from "@/service/IService/IPatientService";

export const useConfirmRegistrationModule = () => {
  const patientService = useInjection<IPatientService>(TYPES.patientService);
  const location = useLocation();

  const [confirmationStatus, setConfirmationStatus] = useState<string>("Processing confirmation...");
  const [loading, setLoading] = useState<boolean>(true);
const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const hasInitialized = useRef(false);

  const confirmRegistration = async (token: string) => {
    try {
      console.log("123");
      const response = await patientService.confirmRegistration(token);
      setConfirmationStatus("Registration confirmed successfully.");
    } catch (error: any) {
      console.error( "Error confirming profile update:", error);

      // Captura a mensagem específica do backend, se existir
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
      } finally {
      setLoading(false);
    }
  };



  if (!hasInitialized.current) {
    hasInitialized.current = true;
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      confirmRegistration(token);
    } else {
      setConfirmationStatus("Invalid token.");
    }
  }

  return {
    confirmationStatus, loading, popupMessage, setPopupMessage
  };
};
