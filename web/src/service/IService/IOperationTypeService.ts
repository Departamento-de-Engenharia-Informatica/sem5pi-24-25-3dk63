import { OperationType } from "@/model/OperationType";
export interface IOperationTypeService {
  getOperationTypes(): Promise<OperationType[]>;
}