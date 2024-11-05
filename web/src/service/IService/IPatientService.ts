import { PatientUser } from "@/model/PatientUser";
import { Patient } from "../../model/Patient";
import { PatientCreateDTO } from "@/dto/PatientCreateDTO";

export interface IPatientService {
  getPatients(): Promise<PatientUser[]>;
  searchPatients(query: Record<string, string>): Promise<PatientUser[]>
  deletePatient(id: string): Promise<void>;
  updatePatient(id: string, updatedData: Partial<Patient>): Promise<void>;
  createPatient(data: PatientCreateDTO): Promise<PatientUser>;
  getAppointments(): Promise<PatientUser[]>;
  getMedicalRecords(): Promise<PatientUser[]>;
}
