import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import type { HttpService } from "./IService/HttpService";
import { IOperationRequestService } from "./IService/IOperationRequestService";
import { OperationRequest } from "@/model/OperationRequest";
import { UpdateOperationRequestDTO } from "@/dto/UpdateOperationRequestDTO";
import { CreatingOperationRequestDTO } from "@/dto/CreatingOperationRequestDTO";
import routeconfiguration from "@/config/routeconfiguration.json";

@injectable()
export class OperationRequestService implements IOperationRequestService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getOperationRequests(): Promise<OperationRequest[]> {
    try {
      const res = await this.http.get<OperationRequest[]>(routeconfiguration.OPERATION_REQUEST_DOCTOR, { 
        headers: { 
          withCredentials: "true"
        }
      });
      console.log("Operation requests:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching operation requests:", error);
      throw new Error("Failed to fetch operation requests.");
    }
  }
  
  async searchOperationRequests(query: Record<string, string>): Promise<OperationRequest[]> {
    const queryString = new URLSearchParams(query).toString();
    console.log("Query string:", queryString);
  
    const res = await this.http.get<OperationRequest[]>(`${routeconfiguration.SEARCH_OPERATION_REQUEST}?${queryString}`, { 
      headers: { 
        withCredentials: "true" 
      }
    });
  
    return res.data;
  }

  async createOperationRequest(operationRequest: CreatingOperationRequestDTO): Promise<void> {
    await this.http.post(routeconfiguration.OPERATION_REQUEST, operationRequest);
  }

  async deleteOperationRequest(id: string): Promise<void> {
    await this.http.delete(`${routeconfiguration.SEARCH_OPERATION_REQUEST}/${id}`);
    console.log("Operation request deleted:", id);
  }

  async editOperationRequest(operationRequest: UpdateOperationRequestDTO): Promise<void> {~
    await this.http.patch(`${routeconfiguration.SEARCH_OPERATION_REQUEST}/${operationRequest.Id}`, operationRequest);
    console.log("Operation request updated:", operationRequest.Id);
  }

  async deactivateOperationRequest(id: string): Promise<void> {
    await this.http.patch(`${routeconfiguration.DEACTIVATE_OPERATION_REQUEST}/${id}`, {});
  }
}
