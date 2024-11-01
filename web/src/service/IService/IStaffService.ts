import { StaffUser } from "@/model/StaffUser";

export interface IStaffService {
  getStaffs(): Promise<StaffUser[]>;
  deleteStaff(id: string): Promise<void>;
}