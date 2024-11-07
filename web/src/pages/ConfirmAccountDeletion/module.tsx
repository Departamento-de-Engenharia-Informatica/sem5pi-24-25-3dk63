import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PatientService } from "@/service/patientService";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";

export const useAccountDeletionModule = (token: string | undefined) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const patientService = useInjection<PatientService>(TYPES.patientService);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Token not provided.");
      setLoading(false);
      return;
    }

    const confirmDeletion = async () => {
      setLoading(true);
      try {
        await patientService.confirmAccountDeletion(token);
        setIsDeleted(true);
      } catch (err: any) {
        setError(err.response?.data || "Error confirming deletion.");
      } finally {
        setLoading(false);
      }
    };

    confirmDeletion();
  }, [token]);

  return { isDeleted, loading, error };
};
