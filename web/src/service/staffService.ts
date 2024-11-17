import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import type { HttpService } from "./IService/HttpService";
import { IStaffService } from "./IService/IStaffService";
import { StaffUser } from "@/model/StaffUser";
import { PendingStaffChangesDTO } from "@/dto/PendingStaffChangesDTO";
import { CreatingStaffDTO } from "@/dto/CreatingStaffDTO";
import { Specialization } from "@/model/Specialization";
@injectable()
export class StaffService implements IStaffService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getStaffs(): Promise<StaffUser[]> {
    const res = await this.http.get<StaffUser[]>("/staff/search");

    return res.data;
  }

  async addStaff(staff: CreatingStaffDTO): Promise<void> {
    await this.http.post("/Staff", staff);
  }

  async searchStaffs(query: Record<string, string>): Promise<StaffUser[]> {
    let queryString = new URLSearchParams(query).toString();
    let res = await this.http.get<StaffUser[]>(`/staff/search?${queryString}`);
    return res.data;
  }

  async deleteStaff(id: string): Promise<void> {
    await this.http.delete(`/staff/${id}`);
    console.log("Staff deleted:", id);
  }

  async editStaff(licenseNumber: string, staff: PendingStaffChangesDTO): Promise<string>{
    let id = licenseNumber;
    const res = await this.http.patch(`/staff/update/${id}`, staff);
    console.log("Staff edited:", res.data);

    return res.data as string;
  }

  async deactivateStaff(id: string): Promise<void> {
    await this.http.patch(`/staff/deactivate/${id}`, {});
  }

  async getSpecializations(): Promise<string[]> {
    const res = await this.http.get<Specialization[]>("/specialization");

    return res.data.map((specialization) => specialization.description);

  }

  async confirmProfileUpdate(token: string): Promise<void> {
    try {
      await this.http.get("/staff/confirm-update", { params: { token }, headers: { withCredentials: "true" } });
    } catch (error) {
      throw new Error("Failed to confirm account update.");
    }
  }
  
}