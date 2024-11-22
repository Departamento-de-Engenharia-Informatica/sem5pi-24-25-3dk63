import React from "react";
import { useNavigate } from "react-router-dom";
export const useAdminMenuModule = () => {

const [alertMessage, setAlertMessage] = React.useState<string | null>(null);
const navigate = useNavigate();

const menuOptions = [
  {
    label: "Patients",
    action: () => navigate("/admin/patient")
  },
  {
    label: "Staff",
    action: () => navigate("/admin/staff")
  },

  {
    label: "Operation Types",
    action: () => navigate("/admin/operation-type")
  }
];


  return {  setAlertMessage, menuOptions, alertMessage, };

}
