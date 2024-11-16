import { StaffUser } from "@/model/StaffUser";
import { PendingStaffChangesDTO } from "@/dto/PendingStaffChangesDTO";
import { CreatingStaffDTO } from "@/dto/CreatingStaffDTO";
export interface IStaffService {
  getStaffs(): Promise<StaffUser[]>;
  addStaff(staff: CreatingStaffDTO): Promise<void>;
  searchStaffs(query: Record<string, string>): Promise<StaffUser[]>;
  deleteStaff(id: string): Promise<void>;
  editStaff(licenseNumber: string, staff: PendingStaffChangesDTO): Promise<string>;
  deactivateStaff(id: string): Promise<void>;
  getSpecializations(): Promise<string[]>;
  getDoctorLicenseNumber(id: string): Promise<string>;
}