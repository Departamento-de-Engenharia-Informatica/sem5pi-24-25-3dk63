import React from "react";
import { useNavigate } from "react-router-dom";

export const useStaffMenuModule = () => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);

  const handleManageOperationRequests = () => {
    navigate("/staff/operation-requests");
  };

  const handleSurgeryRooms = () => {
    navigate("/staff/surgery-rooms");
  };

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
  ];

  const handle3DFloor = () => {
    navigate("/staff/floor");
  };

  return { setAlertMessage,
    handleManageOperationRequests,
    menuOptions,
    handleSurgeryRooms,
     alertMessage,
     handle3DFloor };
};
