import React from "react";
import { useNavigate } from "react-router-dom";
import { PatientService } from "@/service/patientService";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { useState, useEffect, act } from "react";
import { set } from "node_modules/cypress/types/lodash";

const countryOptions = [
  { code: "+351" },
  { code: "+1" },
  { code: "+44" },
];

export const usePatientMenuModule = () => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeletionRequested, setIsDeletionRequested] = useState<boolean>(false);
  const [updateProfileData, setUpdateProfile] = useState<any>({});
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState(countryOptions[0].code);
  const [phoneNumberPart, setPhoneNumberPart] = useState("");

  const patientService = useInjection<PatientService>(TYPES.patientService);

  const handleAppointments = () => {
    navigate("/patient/appointments");
  };

  const handleMedicalRecords = () => {
    navigate("/patient/medical-record");
  };
  
  useEffect(() => {
    if (isModalVisible) {
      setUpdateProfile({});
    }
  }, [isModalVisible]);

  const submitProfileUpdate = async () => {
    if (Object.keys(updateProfileData).length === 0) {
      setPopupMessage("Please fill in at least one field before submitting.");
      return;
    }
  
    if (loading) return;
  
    setLoading(true);
    try {
      await patientService.updateProfile(updateProfileData);
      setPopupMessage("Please check your email to confirm the changes.");
      setIsModalVisible(false);
    } catch (error) {
      setPopupMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleAccountDeletionRequest = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await patientService.requestAccountDeletion();
      setAlertMessage("Account deletion requested. Please check your email to confirm.");
      setIsDeletionRequested(true);
    } catch (error) {
      setAlertMessage("Failed to request account deletion.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    if (value.trim() === "") return;
    setUpdateProfile({ ...updateProfileData, [field]: value });
  };

  const handlePhoneNumberChange = (value: string) => {
    const inputValue = value.trim();
    if (/^\d*$/.test(inputValue)) {
      setPhoneNumberPart(inputValue);
      if (inputValue !== "") {
        setUpdateProfile({
          ...updateProfileData,
          phoneNumber: { number: `${countryCode}${inputValue}` },
        });
      }
    }
  };

  return {
    alertMessage,
    loading,
    isDeletionRequested,
    updateProfileData,
    setUpdateProfile,
    isModalVisible,
    submitProfileUpdate,
    setIsModalVisible,
    popupMessage,
    setPopupMessage,
    countryOptions,
    countryCode,
    setCountryCode,
    phoneNumberPart,
    setPhoneNumberPart,
    handleAppointments,
    handleMedicalRecords,
    handleAccountDeletionRequest,
    handleChange,
    handlePhoneNumberChange,
  };
};
