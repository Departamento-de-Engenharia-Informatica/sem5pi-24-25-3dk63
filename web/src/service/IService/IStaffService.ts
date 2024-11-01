import { StaffUser } from "@/model/StaffUser";

export interface IStaffService {
  getStaffs(): Promise<StaffUser[]>;
  editStaff(staff: StaffUser): Promise<StaffUser>;
  deactivateStaff(staff: StaffUser): Promise<StaffUser>;
}