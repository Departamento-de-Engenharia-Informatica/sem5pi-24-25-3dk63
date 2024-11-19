import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IPatientService } from "@/service/IService/IPatientService";

export const useConfirmUpdateModule = () => {
  const patientService = useInjection<IPatientService>(TYPES.patientService);
  const location = useLocation();

  const [confirmationStatus, setConfirmationStatus] = useState<string>("Processing confirmation...");
  const [loading, setLoading] = useState<boolean>(true);
  const [hasProcessed, setHasProcessed] = useState<boolean>(false);

  const confirmUpdate = async (token: string | null) => {
    if (!token) {
      setConfirmationStatus("Token not found. Please request another update.");
      setLoading(false);
      return;
    }

    try {
      const response = await patientService.confirmUpdate(token);

      if (!response) {
        throw new Error("No response from the server.");
      }

      let responseData;
      try {
        responseData = JSON.parse(response);
      } catch (parseError) {
        setConfirmationStatus("Failed to confirm update: Invalid response format.");
        return;
      }

      if (responseData.Error) {
        setConfirmationStatus("This update has already been confirmed.");
      } else {
        setConfirmationStatus("Update confirmed successfully. Your changes have been applied.");
      }
    } catch (error) {
      setConfirmationStatus("Update confirmed successfully. Your changes have been applied.");
    } finally {
      setLoading(false);
      setHasProcessed(true);
    }
  };

  useEffect(() => {
    if (hasProcessed) return;

    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    confirmUpdate(token);
  }, [location.search, hasProcessed]);

  return { confirmationStatus, loading };
};
