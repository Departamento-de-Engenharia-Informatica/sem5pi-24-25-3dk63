import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button/index";
import Alert from "@/components/Alert/index";
import HamburgerMenu from "@/components/HamburgerMenu";


export const usePatientSelfRegisterModule = () => {

  const navigate = useNavigate();

  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);
  
  const handleSelfRegister = () => {
    navigate("/self-register/register");
  }

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
  ];

  return {  setAlertMessage, handleSelfRegister, menuOptions, alertMessage, };

}
