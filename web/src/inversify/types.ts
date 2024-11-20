import { LoginService } from "@/service/loginService";

export const TYPES = {
  userService: Symbol.for("UserService"),
  patientService: Symbol.for("PatientService"),
  localStorage: Symbol.for("LocalStorage"),
  staffService: Symbol.for("StaffService"),
  operationTypeService: Symbol.for("OperationTypeService"),
  specializationsService: Symbol.for("SpecializationService"),
  operationRequestService: Symbol.for("OperationRequestService"),
  surgeryRoomService: Symbol.for("SurgeryRoomService"),
  LoginService: Symbol.for("LoginService"),
  api: Symbol.for("Api"),
};
