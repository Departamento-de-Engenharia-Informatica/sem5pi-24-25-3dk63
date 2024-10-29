// src/model/Patient.ts
export interface Patient {
  id: string;
  userId: string;
  dateOfBirth: string;
  gender: string;
  medicalHistory: string;
  emergencyContact: string;
  active: boolean;
}
