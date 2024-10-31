export interface PatientCreateDTO {
    firstName: {
        value: string;
    };
    lastName: {
        value: string;
    };
    dateOfBirth: {
      date: string;
    };
    email: {
      value: string;
    };
    phone: {
        value: string;
      };
    emergencyContact: {
      emergencyContact: string;
    };
  }
  