export interface RegisterPatientDTO {
    dateOfBirth: {
      date: string;
    };
    gender: {
      value: string;
    };
    emergencyContact: {
      emergencyContact: string;
    };
    appointmentHistoryList: Array<{
      appointmentDate: Date;
      doctorName: string;
    }>;
    email: {
      value: string;
    };
    firstName: {
        value: string;
    };
    lastName: {
        value: string;
    };
    phoneNumber: {
        value: string;
    };
  }
  