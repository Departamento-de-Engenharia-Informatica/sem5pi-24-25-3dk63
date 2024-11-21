import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import type { HttpService } from "./IService/HttpService";
import { IStaffService } from "./IService/IStaffService";
import { StaffUser } from "@/model/StaffUser";
import { PendingStaffChangesDTO } from "@/dto/PendingStaffChangesDTO";
import { CreatingStaffDTO } from "@/dto/CreatingStaffDTO";
import { Specialization } from "@/model/Specialization";
import { Staff } from "@/model/Staff";
import routeconfiguration from "@/config/routeconfiguration.json";

@injectable()
export class StaffService implements IStaffService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getStaffs(): Promise<StaffUser[]> {
    const res = await this.http.get<StaffUser[]>(routeconfiguration.SEARCH_STAFF);

    return res.data;
  }

  async addStaff(staff: CreatingStaffDTO): Promise<void> {
    await this.http.post(routeconfiguration.STAFF, staff);
  }

  async searchStaffs(query: Record<string, string>): Promise<StaffUser[]> {
    let queryString = new URLSearchParams(query).toString();
    let res = await this.http.get<StaffUser[]>(`${routeconfiguration.SEARCH_STAFF}?${queryString}`);
    return res.data;
  }

  async deleteStaff(id: string): Promise<void> {
    await this.http.delete(`${routeconfiguration.STAFF}/${id}`);
    console.log("Staff deleted:", id);
  }

  async editStaff(licenseNumber: string, staff: PendingStaffChangesDTO): Promise<string>{
    let id = licenseNumber;
    const res = await this.http.patch(`${routeconfiguration.STAFF_UPDATE}/${id}`, staff);
    console.log("Staff edited:", res.data);

    return res.data as string;
  }

  async deactivateStaff(id: string): Promise<void> {
    await this.http.patch(`${routeconfiguration.DEACTIVATE_STAFF}/${id}`, {});
  }

  async getSpecializations(): Promise<string[]> {
    const res = await this.http.get<Specialization[]>(routeconfiguration.SPECIALIZATION);

    return res.data.map((specialization) => specialization.description);

  }

  async confirmProfileUpdate(token: string): Promise<void> {
    try {
      await this.http.get(routeconfiguration.STAFF_CONFIRM_UPDATE, { params: { token }, headers: { withCredentials: "true" } });
    } catch (error) {
      throw new Error("Failed to confirm account update.");
    }
  }
  
  async getDoctor(id: string): Promise<Staff>{
    const res = await this.http.get<Staff>(`${routeconfiguration.STAFF_DOCTOR}/${id}`);
    return res.data;
  }
}