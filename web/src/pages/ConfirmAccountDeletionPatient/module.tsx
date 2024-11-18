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
  const [hasProcessed, setHasProcessed] = useState<boolean>(false);

  const confirmDeletion = async (token: string) => {
    try {
      const response = await patientService.confirmDeletion(token);

      if (!response) {
        throw new Error("No response from the server.");
      }

      let responseData;
      try {
        responseData = JSON.parse(response);
      } catch (parseError) {
        setConfirmationStatus("This account has already been deleted or the token has expired.");
        return;
      }

      if (responseData.Error) {
        setConfirmationStatus("This account has already been deleted.");
      } else {
        setConfirmationStatus("Account deletion confirmed successfully.");
      }
    } catch (error) {
      setConfirmationStatus("This account has already been deleted or the token has expired.");
    } finally {
      setLoading(false);
      setHasProcessed(true);
    }
  };

  useEffect(() => {
    if (hasProcessed) return;

    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setConfirmationStatus("Token not found. Please request another deletion.");
      setLoading(false);
      return;
    }

    setLoading(true);
    confirmDeletion(token);
  }, [location.search, hasProcessed]);

  return { confirmationStatus, loading };
};
