import React from "react";
import { useNavigate } from "react-router-dom";

export const useStaffMenuModule = () => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);

  const handleManageOperationRequests = () => {
    navigate("/staff/operation-requests");
  };

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
  ];

  return { setAlertMessage, handleManageOperationRequests, menuOptions, alertMessage };
};
