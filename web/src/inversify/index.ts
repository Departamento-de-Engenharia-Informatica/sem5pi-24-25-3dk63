import { Container } from "inversify";
import { TYPES } from "./types";
import { UserService } from "@/service/userService";
import { PatientService } from "@/service/patientService";
import { IPatientService } from "@/service/IService/IPatientService"; // Import da interface
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

export { container };
