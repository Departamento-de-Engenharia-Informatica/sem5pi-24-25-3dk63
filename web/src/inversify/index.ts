import { Container } from "inversify";
import { TYPES } from "./types";
import { UserService } from "@/service/userService";
import { PatientService } from "@/service/patientService";
import { IPatientService } from "@/service/IService/IPatientService";
import { StaffService, } from "@/service/staffService";
import { IStaffService } from "@/service/IService/IStaffService";
import { OperationTypeService } from "@/service/operationTypeService";
import {IOperationTypeService} from "@/service/IService/IOperationTypeService";
import {SpecializationsService} from  "@/service/specializationsService";
import {ISpecializationService} from "@/service/IService/ISpecializationService";
import { SurgeryRoomService } from "@/service/surgeryRoomService";
import { ISurgeryRoomService } from "@/service/IService/ISurgeryRoomService";

import { IOperationRequestService } from "@/service/IService/IOperationRequestService";
import { api } from "../service/api";
import { OperationRequestService } from "@/service/operationRequestService";

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

container.bind<IOperationTypeService>(TYPES.operationTypeService).to(OperationTypeService);

container.bind<ISpecializationService>(TYPES.specializationsService).to(SpecializationsService);

container.bind<ISurgeryRoomService>(TYPES.surgeryRoomService).to(SurgeryRoomService);

container.bind(TYPES.userService).to(UserService);
container.bind<IOperationRequestService>(TYPES.operationRequestService).to(OperationRequestService);


export { container };
