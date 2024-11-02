import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button/index";
import Alert from "@/components/Alert/index";
import HamburgerMenu from "@/components/HamburgerMenu";


export const useAdminMenuModule = () => {

  const navigate = useNavigate();

  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);


  const handleManagePatients = () => {
    navigate("/admin/patient");
  };

  const handleManageStaff = () => {
    navigate("/admin/staff");
  };
  
  const handleManageOperationTypes = () => {
    navigate("/admin/operation-type");
  }

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
  ];

  return {  setAlertMessage, handleManagePatients, handleManageStaff,handleManageOperationTypes, menuOptions, alertMessage, };

}
