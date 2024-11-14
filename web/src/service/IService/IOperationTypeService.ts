import { OperationType } from "@/model/OperationType";
import { CreatingOperationTypeDTO } from "@/dto/CreatingOperationTypeDTO";
import { UpdateOperationTypeDTO } from "@/dto/UpdateOperationTypeDTO";

export interface IOperationTypeService {
  getOperationTypes(): Promise<OperationType[]>;
  deactivateOperationType(id: string): Promise<void>;
  addOperationType(operationType: CreatingOperationTypeDTO): Promise<void>;
  searchOperationTypes(query: Record<string, string>): Promise<OperationType[]>;
  updateOperationType(operationType: UpdateOperationTypeDTO): Promise<void>;
}