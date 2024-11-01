import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import type { HttpService } from "./IService/HttpService";
import { IStaffService } from "./IService/IStaffService";
import { StaffUser } from "@/model/StaffUser";

@injectable()
export class StaffService implements IStaffService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getStaffs(): Promise<StaffUser[]> {
    const res = await this.http.get<StaffUser[]>("/staff");
    console.log("Dados retornados do getAllStaffs:", res.data);

    return res.data;
  }
}