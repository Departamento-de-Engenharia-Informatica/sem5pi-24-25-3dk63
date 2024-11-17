import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StaffService } from "@/service/staffService"; // Altere para o serviço correto
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";

export const useProfileUpdateModule = (token: string | undefined) => {
  const [isUpdated, setIsUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const staffService = useInjection<StaffService>(TYPES.staffService); // Injeta o serviço
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Token not provided.");
      setLoading(false);
      return;
    }

    const confirmUpdate = async () => {
      setLoading(true);
      try {
        await staffService.confirmProfileUpdate(token);
        setIsUpdated(true);
      } catch (err: any) {
      } finally {
        setLoading(false);
      }
    };

    confirmUpdate();
  }, [token]);

  return { isUpdated, loading, error };
};
