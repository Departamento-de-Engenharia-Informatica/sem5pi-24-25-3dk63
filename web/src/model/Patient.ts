// src/model/Patient.ts
export interface Patient {
  id: {
    value: string;
  };
  userId: {
    value: string;
  };
  dateOfBirth: {
    date: string;
  };
  gender: {
    gender: string;
  };
  medicalHistory: {
    medicalHistory: string;
  };
  emergencyContact: {
    emergencyContact: string;
  };
  active: boolean;
}
