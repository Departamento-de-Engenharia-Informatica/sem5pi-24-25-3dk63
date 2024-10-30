import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import type { HttpService } from "./IService/HttpService";
import { Patient } from "@/model/Patient";
import { IPatientService } from "./IService/IPatientService";

@injectable()
export class PatientService implements IPatientService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getPatients(): Promise<Patient[]> {
    const res = await this.http.get<Patient[]>("/patients");
    return res.data;
  }
}
