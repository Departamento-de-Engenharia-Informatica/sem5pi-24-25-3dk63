import { inject, injectable } from "inversify";

import "reflect-metadata";

import { TYPES } from "../inversify/types";
import { PatientUpdateDTO } from "@/dto/PatientUpdateDTO";
import { RegisterPatientDTO } from "@/dto/RegisterPatientDTO";
import { SelfRegisterPatientDTO } from "@/dto/SelfRegisterPatientDTO";
import { UpdateProfileDTO } from "@/dto/UpdateProfileDTO";
import { Patient } from "@/model/Patient";
import { PatientUser } from "@/model/PatientUser";

import type { HttpService } from "./IService/HttpService";
import { IPatientService } from "./IService/IPatientService";

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
    let res = await this.http.get<PatientUser[]>(
      `/patients/search?${queryString}`
    );
    return res.data;
  }

  async deletePatient(id: string): Promise<void> {
    await this.http.delete(`/patients/${id}`);
    console.log("Patient deleted:", id);
  }

  async updatePatient(
    id: string,
    updatedData: Partial<PatientUpdateDTO>
  ): Promise<void> {
    await this.http.patch(`/patients/${id}`, updatedData);
    console.log("Patient updated:", id);
  }

  async createPatient(patientData: RegisterPatientDTO): Promise<PatientUser> {
    const res = await this.http.post<PatientUser>(
      "/patients/register-patient",
      patientData
    );
    console.log("Patient created:", res.data);
    return res.data;
  }

  async selfRegister(patientData: SelfRegisterPatientDTO): Promise<Response> {
    const res = await this.http.post<Response>(
      "/Registrations/self-register",
      {personalEmail: patientData.personalEmail},
      { headers: { withCredentials: "true" } }
      );

    return res.data;
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
      await this.http.post(
        "/patients/request-account-deletion",
        {},
        { headers: { withCredentials: "true" } }
      );
    } catch (error) {
      throw new Error("Failed to request account deletion.");
    }
  }

  async confirmUpdate(token: string): Promise<string> {
    try {
      const res = await this.http.get<{ data: string }>(
        `/patients/confirm-update?token=${token}`,
        {
          headers: { withCredentials: "true" },
        }
      );
      return res.data.data;
    } catch (error) {
      throw new Error("Failed to confirm profile update.");
    }
  }

  async confirmDeletion(token: string): Promise<string> {
    try {
      const res = await this.http.get<{ data: string }>(
        `/patients/confirm-account-deletion?token=${token}`,
        {
          headers: { withCredentials: "true" },
        }
      );
      return res.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to confirm account deletion.");
    }
  }

  async updateProfile(data: UpdateProfileDTO): Promise<void> {
    try {
      console.log("Data to update profile:", data);
      await this.http.patch("/patients/update", data, {
        headers: { withCredentials: "true" },
      });
    } catch (error) {
      throw new Error("Failed to update profile.");
    }
  }

  async confirmRegistration(token: string): Promise<string> {
    try {
      const res = await this.http.get<{ data: string }>(
        `/Registrations/confirm-email?token=${token}`
      );
      return res.data.data;
    } catch (error) {
      throw new Error("Failed to confirm registration. Error: " + error);
    }
  }
}
