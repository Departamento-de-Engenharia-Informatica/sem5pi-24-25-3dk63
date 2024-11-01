import { Container } from "inversify";
import { TYPES } from "./types";
import { UserService } from "@/service/userService";
import { PatientService } from "@/service/patientService";
import { IPatientService } from "@/service/IService/IPatientService";
import { StaffService, } from "@/service/staffService";
import { IStaffService } from "@/service/IService/IStaffService";

import { api } from "../service/api";

const container = new Container();

container.bind(TYPES.localStorage).toConstantValue(
  import.meta.env.MODE !== "staging"
    ? window.localStorage
    : {
        getItem: () => null,
      }
);
container.bind(TYPES.api).toConstantValue(api);

container.bind<IPatientService>(TYPES.patientService).to(PatientService);

container.bind<IStaffService>(TYPES.staffService).to(StaffService);

export { container };
