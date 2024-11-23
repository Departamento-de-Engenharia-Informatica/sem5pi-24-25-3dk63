import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IPatientService } from "@/service/IService/IPatientService";

export const usePatientSelfRegisterModule = () => {
  const navigate = useNavigate();
  const patientService = useInjection<IPatientService>(TYPES.patientService);

  // State for the email input
  const [selfRegisteringPatient, setSelfRegisteringPatient] = useState<any | null>(null);
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  // Handler for form submission
  const handleSelfRegister = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Self-Register Patient")

    const newDto = {
      personalEmail: "",
    };

    console.log("New self register:", newDto.personalEmail);
    setSelfRegisteringPatient(newDto);
  };

  const saveSelfRegisterPatient = async () => {
    try {

      if (!selfRegisteringPatient) {
        setAlertMessage("Please enter your email.");
        return;
      }

      // Clear alert message
      setAlertMessage(null);

      console.log("Self-Registering Patient:", selfRegisteringPatient);

      // Logic for registration (e.g., API call) here
      setAlertMessage("Registering...");
      const res = await patientService.selfRegister(selfRegisteringPatient);
      setAlertMessage(null);

      const BAD_REQUEST = 400;
      const UNAUTHORIZED = 401;
      if(res.status == BAD_REQUEST)
      {
        console.error("Error while self registering:");
        setPopupMessage("Error while self-registering.");
      }
      else if (res.status == UNAUTHORIZED)
      {
        console.error("Error while self registering:");
        setPopupMessage("Error while self-registering.");
      }
      else
      {
        console.log("Registration initiated. Please check your personal email for confirmation. Redirecting to the login page...")
        setPopupMessage("Registration initiated. Please check your personal email for confirmation. Redirecting to the login page...");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    }
   catch (error: any) {
      console.error( "Error while self registering:", error);

      // Captura a mensagem específica do backend, se existir
      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
  }
  }

  // Menu options for HamburgerMenu
  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
  ];

  return {
    selfRegisteringPatient,
    setSelfRegisteringPatient,
    handleSelfRegister,
    saveSelfRegisterPatient,
    menuOptions,
    alertMessage,
    popupMessage,
    setPopupMessage,
  };
};
