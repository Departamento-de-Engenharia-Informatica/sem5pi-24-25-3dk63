import { PatientUser } from "@/model/PatientUser";
import { Patient } from "../../model/Patient";
import { RegisterPatientDTO } from "@/dto/RegisterPatientDTO";
import { SelfRegisterPatientDTO } from "@/dto/SelfRegisterPatientDTO";
import { UpdateProfileDTO } from "@/dto/UpdateProfileDTO";
export interface IPatientService {
  getPatients(): Promise<PatientUser[]>;
  searchPatients(query: Record<string, string>): Promise<PatientUser[]>
  deletePatient(id: string): Promise<void>;
  updatePatient(id: string, updatedData: Partial<Patient>): Promise<void>;
  createPatient(data: RegisterPatientDTO): Promise<PatientUser>;
  updateProfile(data: UpdateProfileDTO): Promise<void>;
  confirmUpdate(token: string): Promise<string>;
  selfRegister(patientData: SelfRegisterPatientDTO): Promise<Response>;
  getAppointments(): Promise<PatientUser[]>;
  getMedicalRecords(): Promise<PatientUser[]>;
  requestAccountDeletion(): Promise<void>;
  confirmDeletion(token: string): Promise<string>;
  confirmRegistration(token: string): Promise<string>;
}
