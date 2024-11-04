import { Appointment } from "@/model/Appointment";

export interface IAppointmentService {
  getAppointments(): Promise<Appointment[]>;
}