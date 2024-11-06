import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import type { HttpService } from "./IService/HttpService";
import { Specialization } from "../model/Specialization";
import { ISpecializationService } from "../service/IService/ISpecializationService";

@injectable()
export class SpecializationsService implements ISpecializationService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getSpecializations(): Promise<Specialization[]> {
    const res = await this.http.get<Specialization[]>("/specialization");

    return res.data;
  }
}