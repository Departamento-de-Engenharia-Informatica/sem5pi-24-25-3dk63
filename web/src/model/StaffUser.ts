// src/model/StaffUser.ts
export interface StaffUser {
  licenseNumber: string;
  username: string;
  role: string;
  email: string;
  phoneNumber: string;
  name: string; 
  specializationDescription: string;
  availabilitySlots: any[];
  active: boolean;
}
