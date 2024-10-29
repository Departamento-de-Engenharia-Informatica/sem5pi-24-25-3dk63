import { Role } from "../model/Role";

export interface IUserDataDTO {
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
