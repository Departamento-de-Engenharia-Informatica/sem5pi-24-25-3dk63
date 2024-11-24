import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import type { HttpService } from "./IService/HttpService";
import { Specialization } from "../model/Specialization";
import { ISpecializationService } from "../service/IService/ISpecializationService";
import routeconfiguration from "@/config/routeconfiguration.json";

@injectable()
export class SpecializationsService implements ISpecializationService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getSpecializations(): Promise<Specialization[]> {
    const res = await this.http.get<Specialization[]>(routeconfiguration.SPECIALIZATION);

    return res.data;
  }

  async getSpecializationById(id: string): Promise<Specialization>{
    const res = await this.http.get<Specialization>(`${routeconfiguration.SPECIALIZATION}/${id}`);
    return res.data;
  }
}