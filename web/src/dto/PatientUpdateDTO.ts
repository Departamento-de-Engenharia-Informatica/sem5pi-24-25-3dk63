// src/model/PatientUpdateDTO.ts

export interface PatientUpdateDTO {
  id: {
    value: string;
  };
  dateOfBirth?: {
    date: string;
  };
  gender?: {
    gender: string;
  };
  medicalHistory?: {
    medicalHistory: string;
  };
  emergencyContact?: {
    emergencyContact: string;
  };
}
