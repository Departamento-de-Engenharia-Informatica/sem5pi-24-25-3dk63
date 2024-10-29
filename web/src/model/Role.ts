export interface Role {
  value: RoleType;
  title: string;
  description?: string; 
}

export enum RoleType {
  Admin = "Admin",
  Doctor = "Doctor",
  Nurse = "Nurse",
  Technician = "Technician",
  Patient = "Patient"
}
