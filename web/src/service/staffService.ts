import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import type { HttpService } from "./IService/HttpService";
import { IStaffService } from "./IService/IStaffService";
import { StaffUser } from "@/model/StaffUser";
import { PendingStaffChangesDTO } from "@/dto/PendingStaffChangesDTO";
@injectable()
export class StaffService implements IStaffService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getStaffs(): Promise<StaffUser[]> {
    const res = await this.http.get<StaffUser[]>("/staff");

    return res.data;
  }

  async searchStaffs(query: Record<string, string>): Promise<StaffUser[]> {
    const queryString = new URLSearchParams(query).toString();
    const res = await this.http.get<StaffUser[]>(`/staff/search?${queryString}`);
    return res.data;
  }

  async deleteStaff(id: string): Promise<void> {
    await this.http.delete(`/staff/${id}`);
    console.log("Staff deleted:", id);
  }

  async editStaff(licenseNumber: string, staff: PendingStaffChangesDTO): Promise<void>{
    let id = licenseNumber;
    const res = await this.http.patch(`/staff/update/${id}`, staff);
    console.log("Staff edited:", res.data);
    window.confirm(res.data as string);
  }

  async deactivateStaff(id: string): Promise<void> {
    await this.http.patch(`/staff/deactivate/${id}`, {});
  }
}