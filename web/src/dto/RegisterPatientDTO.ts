export interface RegisterPatientDTO {
    dateOfBirth: {
      date: string;
    };
    gender: {
      gender: string;
    };
    emergencyContact: {
      emergencyContact: string;
    };
    appointmentHistoryList: Array<{
      appointmentDate: Date;
      doctorName: string;
    }>;
    personalEmail: {
      value: string;
    };
    name: {
      firstName: string;
      lastName: string;
    };
    phoneNumber: {
      number: string;
    };
    medicalHistory: {
      medicalHistory: string;
    };
  }
  