import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import type { HttpService } from "./IService/HttpService";
import { IOperationRequestService } from "./IService/IOperationRequestService";
import { OperationRequest } from "@/model/OperationRequest";
import { UpdateOperationRequestDTO } from "@/dto/UpdateOperationRequestDTO";

@injectable()
export class OperationRequestService implements IOperationRequestService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getOperationRequests(): Promise<OperationRequest[]> {
    const res = await this.http.get<OperationRequest[]>("/operationRequest");
    return res.data;
  }

  async searchOperationRequests(query: Record<string, string>): Promise<OperationRequest[]> {
    const queryString = new URLSearchParams(query).toString();
    const res = await this.http.get<OperationRequest[]>(`/operationRequest/search?${queryString}`);
    return res.data;
  }

  async createOperationRequest(operationRequest: UpdateOperationRequestDTO): Promise<void> {
    const res = await this.http.post("/operationRequest", operationRequest);
    console.log("Operation request created:", res.data);
    window.confirm(res.data as string);
  }

  async deleteOperationRequest(id: string): Promise<void> {
    await this.http.delete(`/operationRequest/${id}`);
    console.log("Operation request deleted:", id);
  }

  async editOperationRequest(operationRequestId: string, operationRequest: UpdateOperationRequestDTO): Promise<void> {
    const res = await this.http.patch(`/operationRequest/${operationRequestId}`, operationRequest);
    console.log("Operation request edited:", res.data);
    window.confirm(res.data as string);
  }

  async deactivateOperationRequest(id: string): Promise<void> {
    await this.http.patch(`/operationRequest/deactivate/${id}`, {});
  }
}
