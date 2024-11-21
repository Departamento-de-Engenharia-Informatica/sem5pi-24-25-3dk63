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
import routeconfiguration from "@/config/routeconfiguration.json";

@injectable()
export class PatientService implements IPatientService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getPatients(): Promise<PatientUser[]> {
    const res = await this.http.get<PatientUser[]>(routeconfiguration.PATIENTS);
    console.log("Dados retornados do getAllPatients:", res.data);
    return res.data;
  }

  async searchPatients(query: Record<string, string>): Promise<PatientUser[]> {
    let queryString = new URLSearchParams(query).toString();
    let res = await this.http.get<PatientUser[]>(
      `${routeconfiguration.SEARCH_PATIENTS}?${queryString}`
    );
    return res.data;
  }

  async deletePatient(id: string): Promise<void> {
    await this.http.delete(`${routeconfiguration.PATIENTS}/${id}`);
    console.log("Patient deleted:", id);
  }

  async updatePatient(
    id: string,
    updatedData: Partial<PatientUpdateDTO>
  ): Promise<void> {
    await this.http.patch(`${routeconfiguration.PATIENTS}/${id}`, updatedData);
    console.log("Patient updated:", id);
  }

  async createPatient(patientData: RegisterPatientDTO): Promise<PatientUser> {
    const res = await this.http.post<PatientUser>(
      routeconfiguration.PATIENT_REGISTRATION,
      patientData
    );
    console.log("Patient created:", res.data);
    return res.data;
  }

  async selfRegister(patientData: SelfRegisterPatientDTO): Promise<Response> {
    const res = await this.http.post<Response>(
      routeconfiguration.PATIENT_SELF_REGISTRATION,
      {personalEmail: patientData.personalEmail},
      { headers: { withCredentials: "true" } }
      );

    return res.data;
  }

  async getAppointments(): Promise<PatientUser[]> {
    const res = await this.http.get<PatientUser[]>(routeconfiguration.PATIENT_APPOINTMENTS);
    return res.data;
  }

  async getMedicalRecords(): Promise<PatientUser[]> {
    const res = await this.http.get<PatientUser[]>(routeconfiguration.PATIENT_MEDICALHISTORY);
    return res.data;
  }

  async requestAccountDeletion(): Promise<void> {
    try {
      await this.http.post(
        routeconfiguration.PATIENT_REQUEST_ACCOUNT_DELETION,
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
        `${routeconfiguration.PATIENT_CONFIRM_UPDATE}?token=${token}`,
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
        `${routeconfiguration.PATIENT_CONFIRM_ACCOUNT_DELETION}?token=${token}`,
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
      await this.http.patch(routeconfiguration.PATIENTS_UPDATE, data, {
        headers: { withCredentials: "true" },
      });
    } catch (error) {
      throw new Error("Failed to update profile.");
    }
  }

  async confirmRegistration(token: string): Promise<string> {
    try {
      const res = await this.http.get<{ data: string }>(
        `${routeconfiguration.PATIENT_CONFIRM_REGISTRATION}?token=${token}`
      );
      return res.data.data;
    } catch (error) {
      throw new Error("Failed to confirm registration. Error: " + error);
    }
  }
}
