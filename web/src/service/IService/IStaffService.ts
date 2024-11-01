import { StaffUser } from "@/model/StaffUser";

export interface IStaffService {
  getStaffs(): Promise<StaffUser[]>;
}