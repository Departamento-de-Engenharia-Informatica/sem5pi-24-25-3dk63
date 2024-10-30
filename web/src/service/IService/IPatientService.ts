import { Patient } from "../../model/Patient";

export interface IPatientService {
  getPatients(): Promise<Patient[]>;
}
