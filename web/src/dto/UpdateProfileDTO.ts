
export interface UpdateProfileDTO {
  id: {
    value: string;
  };
  firstName?: string;
  lastName?: string;
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
