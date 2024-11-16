import { OperationRequest } from "@/model/OperationRequest";
import { UpdateOperationRequestDTO } from "@/dto/UpdateOperationRequestDTO";
import { CreatingOperationRequestDTO } from "@/dto/CreatingOperationRequestDTO";

export interface IOperationRequestService {
    getOperationRequests(): Promise<OperationRequest[]>;
    searchOperationRequests(query: Record<string, string>): Promise<OperationRequest[]>;
    createOperationRequest(operationRequest: CreatingOperationRequestDTO): Promise<void>;
    deleteOperationRequest(id: string): Promise<void>;
    editOperationRequest(operationRequest: UpdateOperationRequestDTO): Promise<void>;
    deactivateOperationRequest(id: string): Promise<void>;
  }