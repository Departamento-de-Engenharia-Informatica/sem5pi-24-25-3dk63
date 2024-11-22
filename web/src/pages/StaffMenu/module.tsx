import React from "react";
import { useNavigate } from "react-router-dom";

export const useStaffMenuModule = () => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);



  const menuOptions = [
  {
    label: "Manage requests",
    action: () => navigate("/staff/operation-requests")
  },
  {
    label: "Open 3D",
    action: () => navigate("/staff/floor")
  },

  {
    label: "Surgery Rooms",
    action: () => navigate("/staff/surgery-rooms")
  }
];

  return { setAlertMessage,
    menuOptions,
     alertMessage,
      };
};
