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

  const confirmUpdate = async (token: string | null) => {
    if (!token) {
      setConfirmationStatus("Token not found. Please request another update.");
      setLoading(false);
      return;
    }

    try {
      const response = await patientService.confirmUpdate(token);
      setConfirmationStatus(response);
    }
    catch (error:any) {
      setConfirmationStatus(error?.response?.data?.message || error?.message);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    confirmUpdate(token);
  }, [location.search]);

  return { confirmationStatus, loading };
};
