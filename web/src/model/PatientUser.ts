// src/model/PatientUser.ts
export interface PatientUser {
  id: {
    value: string;
  };
  userId: {
    value: string;
  };
  personalEmail: {
    value: string;
  };
  iamEmail: {
    value: string;
  };
  name: {
    firstName: string;
    lastName: string;
  };
  dateOfBirth: {
    date: string;
  };
  gender: {
    gender: string;
  };
  emergencyContact: {
    emergencyContact: string;
  };
  phoneNumber: {
    number: string;
  };
  medicalHistory: {
    medicalHistory: string;
  };
  appointmentHistoryList: any[];
  active: boolean;
  [key: string]: any;
}
