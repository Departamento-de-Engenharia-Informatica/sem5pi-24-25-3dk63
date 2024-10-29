import { Role } from "./Role";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  active: boolean;
  sequentialNumber: number;
  confirmationToken?: string;  
}
