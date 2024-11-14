
export interface UpdateProfileDTO {
  id: {
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
