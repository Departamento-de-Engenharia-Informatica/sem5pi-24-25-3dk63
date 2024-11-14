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
    try {
      const res = await this.http.get<OperationRequest[]>("/OperationRequest/doctor", { 
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
  
    const res = await this.http.get<OperationRequest[]>(`/OperationRequest/search?${queryString}`, { 
      headers: { 
        withCredentials: "true" 
      }
    });
  
    return res.data;
  }

  async createOperationRequest(operationRequest: UpdateOperationRequestDTO): Promise<void> {
    const res = await this.http.post("/OperationRequest", operationRequest);
    console.log("Operation request created:", res.data);
    window.confirm(res.data as string);
  }

  async deleteOperationRequest(id: string): Promise<void> {
    await this.http.delete(`/OperationRequest/${id}`);
    console.log("Operation request deleted:", id);
  }

  async editOperationRequest(operationRequest: UpdateOperationRequestDTO): Promise<void> {~
    await this.http.patch(`/OperationRequest/${operationRequest.Id}`, operationRequest);
    console.log("Operation request updated:", operationRequest.Id);
  }

  async deactivateOperationRequest(id: string): Promise<void> {
    await this.http.patch(`/OperationRequest/deactivate/${id}`, {});
  }
}
