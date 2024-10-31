import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import type { HttpService } from "./IService/HttpService";
import { IPatientService } from "./IService/IPatientService";
import { PatientUpdateDTO } from "@/dto/PatientUpdateDTO";
import { PatientUser } from "@/model/PatientUser";
import { PatientCreateDTO } from "@/dto/PatientCreateDTO";

@injectable()
export class PatientService implements IPatientService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getPatients(): Promise<PatientUser[]> {
    const res = await this.http.get<PatientUser[]>("/patients");
    console.log("Dados retornados do getAllPatients:", res.data);

    return res.data;
  }

async updatePatient(id: string, updatedData: Partial<PatientUpdateDTO>): Promise<void> {
  const patientUpdateDto: PatientUpdateDTO = {
    id: { value: id },
    ...updatedData,
  };

  await this.http.patch(`/patients/${id}`, patientUpdateDto);
}

async createPatient(patientData: PatientCreateDTO): Promise<PatientUser> {
  const res = await this.http.post<PatientUser>("/patients", patientData);
  console.log("Patient created:", res.data);
  return res.data;
}
}
