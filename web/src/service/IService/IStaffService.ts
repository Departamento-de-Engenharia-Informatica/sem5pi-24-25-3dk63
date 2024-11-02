import { StaffUser } from "@/model/StaffUser";
import { PendingStaffChangesDTO } from "@/dto/PendingStaffChangesDTO";
export interface IStaffService {
  getStaffs(): Promise<StaffUser[]>;
  deleteStaff(id: string): Promise<void>;
  editStaff(licenseNumber: string, staff: PendingStaffChangesDTO): Promise<void>;
  deactivateStaff(id: string): Promise<void>;
}