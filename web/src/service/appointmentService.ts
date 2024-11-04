import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import type { HttpService } from "./IService/HttpService";
import { IAppointmentService } from "./IService/IAppointmentService";
import { Appointment } from "@/model/Appointment";

@injectable()
export class AppointmentService implements IAppointmentService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getAppointments(): Promise<Appointment[]> {
    const res = await this.http.get<Appointment[]>("/Appointment/myappointments");  

    return res.data;
  }
}