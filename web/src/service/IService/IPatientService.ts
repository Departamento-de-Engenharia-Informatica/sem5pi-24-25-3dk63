import { PatientUser } from "@/model/PatientUser";
import { Patient } from "../../model/Patient";

export interface IPatientService {
  getPatients(): Promise<PatientUser[]>;
  updatePatient(id: string, updatedData: Partial<Patient>): Promise<void>;
}
