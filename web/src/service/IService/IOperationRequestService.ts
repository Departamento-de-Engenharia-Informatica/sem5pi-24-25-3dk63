import { OperationRequest } from "@/model/OperationRequest";
import { UpdateOperationRequestDTO } from "@/dto/UpdateOperationRequestDTO";

export interface IOperationRequestService {
    getOperationRequests(): Promise<OperationRequest[]>;
    searchOperationRequests(query: Record<string, string>): Promise<OperationRequest[]>;
    createOperationRequest(operationRequest: UpdateOperationRequestDTO): Promise<void>;
    deleteOperationRequest(id: string): Promise<void>;
    editOperationRequest(operationRequestId: string, operationRequest: UpdateOperationRequestDTO): Promise<void>;
    deactivateOperationRequest(id: string): Promise<void>;
  }