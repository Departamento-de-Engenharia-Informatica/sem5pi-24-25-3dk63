import React from "react";
import { useNavigate } from "react-router-dom";
import { PatientService } from "@/service/patientService";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { useState, useEffect, act } from "react";
import { set } from "node_modules/cypress/types/lodash";
import { UserService } from "@/service/userService";
import { UpdateProfileDTO } from "@/dto/UpdateProfileDTO";

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
  const [cooldownTime, setCooldownTime] = useState(0);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateProfileData, setUpdateProfile] = useState<any>({});
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState(countryOptions[0].code);
  const [phoneNumberPart, setPhoneNumberPart] = useState("");

  const patientService = useInjection<PatientService>(TYPES.patientService);
  const userService = useInjection<UserService>(TYPES.userService);

  const menuOptions = [
  {
    label: "Appointments",
    action: () => navigate("/patient/appointments")
  },
  {
    label: "Medical Record",
    action: () => navigate("/patient/medical-record")
  },

  {
    label: "Edit Profile",
    action: () => setIsModalVisible(true)
  },

    {
    label: "Account Deletion",
    action: () => handleAccountDeletionRequest()
  }
];

  useEffect(() => {
    if (isModalVisible) {
      setUpdateProfile({});
    }
  }, [isModalVisible]);

  const submitProfileUpdate = async () => {
    if (loading) return;
  
    const changedFields = Object.entries(updateProfileData).reduce(
      (acc, [key, value]) => {
        if (key === "phoneNumber") {
          const fullPhoneNumber = `${countryCode}${phoneNumberPart}`;
          if (fullPhoneNumber !== currentProfile?.phoneNumber?.number) {
            acc[key] = { number: fullPhoneNumber };
          }
        } else if (key === "firstName" || key === "lastName") {
          const currentName = currentProfile?.name || {};
          if (
            (key === "firstName" && value !== currentName.firstName) ||
            (key === "lastName" && value !== currentName.lastName)
          ) {
            acc[key] = value as string;
          }
        } else if (key === "email" && value !== currentProfile?.personalEmail?.value) {
          acc[key] = { value: value as string };
        } else if (key === "emergencyContact" && value !== currentProfile?.emergencyContact?.emergencyContact) {
          acc[key] = { emergencyContact: value as string };
        } else if (key === "medicalHistory" && value !== currentProfile?.medicalHistory?.medicalHistory) {
          acc[key] = { medicalHistory: value as string };
        }
        return acc;
      },
      {} as UpdateProfileDTO
    );
  
    const userId = await userService.getUserId();
    changedFields.id = { value: userId };
  
    if (Object.keys(changedFields).length === 1) {
      setPopupMessage("No changes were made to update.");
      return;
    }
    
    setLoading(true);
    try {
      await patientService.updateProfile(changedFields);
      setPopupMessage("Please check your email to confirm the changes.");
      setIsModalVisible(false);
      await fetchCurrentProfile();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "An unknown error occurred.";
      setPopupMessage(errorMessage);
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
    } catch (error: any) {
      console.error( "Error requesting account deletion:", error);

      const errorMessage = error?.response?.data?.message ||
                           error?.message ||
                           "An unknown error occurred.";
      setPopupMessage(errorMessage);
  } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setUpdateProfile((prev: any) => ({
      ...prev,
      [field]: value
    }));
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

  const fetchCurrentProfile = async () => {
    setIsLoading(true);
    try {
      const id = userService.getUserId();
      const profile = await patientService.getPatientById(await id);
      setCurrentProfile(profile);
      
      setUpdateProfile({
        firstName: profile.name?.firstName,
        lastName: profile.name?.lastName,
        email: profile.personalEmail?.value,
        phoneNumber: profile.phoneNumber?.number,
        emergencyContact: profile.emergencyContact?.emergencyContact,
        medicalHistory: profile.medicalHistory?.medicalHistory
      });

      if (profile.phoneNumber?.number) {
        const phoneNumber = profile.phoneNumber.number;
        const countryCodeMatch = phoneNumber.match(/^\+\d{1,3}/);
        if (countryCodeMatch) {
          const code = countryCodeMatch[0];
          setCountryCode(code);
          setPhoneNumberPart(phoneNumber.replace(code, ''));
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setPopupMessage("Error loading profile data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      fetchCurrentProfile();
    }
  }, [isModalVisible]);

  return {
    alertMessage,
    updateProfileData,
    isModalVisible,
    submitProfileUpdate,
    setIsModalVisible,
    popupMessage,
    setPopupMessage,
    countryOptions,
    countryCode,
    setCountryCode,
    phoneNumberPart,
    menuOptions,
    handleChange,
    handlePhoneNumberChange,
    currentProfile,
    isDeletionRequested,
    isLoading,
  };
};
