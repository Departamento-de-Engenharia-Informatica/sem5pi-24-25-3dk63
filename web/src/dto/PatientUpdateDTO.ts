// src/model/PatientUpdateDTO.ts

export interface PatientUpdateDTO {
  id: {
    value: string;
  };
  personalEmail: {
    value: string;
  };
  name?: {
    firstName: string;
    lastName: string;
  };
  email?: {
    value: string;
  };
  emergencyContact?: {
    emergencyContact: string;
  };
  phoneNumber?: {
    number: string;
  };
  medicalHistory?: {
    medicalHistory: string;
  };
}
