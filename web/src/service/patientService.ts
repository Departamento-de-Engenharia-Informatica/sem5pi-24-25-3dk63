import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import type { HttpService } from "./IService/HttpService";
import { IPatientService } from "./IService/IPatientService";
import { PatientUpdateDTO } from "@/dto/PatientUpdateDTO";
import { PatientUser } from "@/model/PatientUser";
import { RegisterPatientDTO } from "@/dto/RegisterPatientDTO";
import { Patient } from "@/model/Patient";
import { SelfRegisterPatientDTO } from "@/dto/SelfRegisterPatientDTO";

@injectable()
export class PatientService implements IPatientService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getPatients(): Promise<PatientUser[]> {
    const res = await this.http.get<PatientUser[]>("/patients");
    console.log("Dados retornados do getAllPatients:", res.data);
    return res.data;
  }

  async searchPatients(query: Record<string, string>): Promise<PatientUser[]> {
    let queryString = new URLSearchParams(query).toString();
    let res = await this.http.get<PatientUser[]>(`/patients/search?${queryString}`);
    return res.data;
  }

  async deletePatient(id: string): Promise<void> {
    await this.http.delete(`/patients/${id}`);
    console.log("Patient deleted:", id);
  }

  async updatePatient(id: string, updatedData: Partial<PatientUpdateDTO>): Promise<void> {
    await this.http.patch(`/patients/${id}`, updatedData);
    console.log("Patient updated:", id);
  }

  async createPatient(patientData: RegisterPatientDTO): Promise<PatientUser> {
    const res = await this.http.post<PatientUser>("/patients/register-patient", patientData);
    console.log("Patient created:", res.data);
    return res.data;
  }

  async selfRegister(patientData: SelfRegisterPatientDTO): Promise<Response> {
    return await fetch("https://localhost:5001/api/Registrations/self-register", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ personalEmail: patientData.personalEmail }),
      credentials: "include",
    });
  }

  async getAppointments(): Promise<PatientUser[]> {
    const res = await this.http.get<PatientUser[]>(`/patients/appointments`);
    return res.data;
  }

  async getMedicalRecords(): Promise<PatientUser[]> {
    const res = await this.http.get<PatientUser[]>(`/patients/medicalhistory`);
    return res.data;
  }
  
  async requestAccountDeletion(): Promise<void> {
    try {
      await this.http.post("/patients/request-account-deletion", {}, { headers: { withCredentials: "true" } });
    } catch (error) {
      throw new Error("Failed to request account deletion.");
    }
  }
  
  async confirmAccountDeletion(token: string): Promise<void> {
    try {
      await this.http.get("/patients/confirm-account-deletion", { params: { token }, headers: { withCredentials: "true" } });
    } catch (error) {
      throw new Error("Failed to confirm account deletion.");
    }
  }
  
  
  
}
