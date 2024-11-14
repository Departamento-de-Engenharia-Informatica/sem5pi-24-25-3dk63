import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import type { HttpService } from "./IService/HttpService";
import { IOperationTypeService } from "./IService/IOperationTypeService";
import { OperationType } from "@/model/OperationType";
import { CreatingOperationTypeDTO } from "@/dto/CreatingOperationTypeDTO";
import { UpdateOperationTypeDTO } from "@/dto/UpdateOperationTypeDTO";

@injectable()
export class OperationTypeService implements IOperationTypeService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getOperationTypes(): Promise<OperationType[]> {
    const res = await this.http.get<OperationType[]>("/OperationType/all");

    return res.data;
  }

  async deactivateOperationType(id: string): Promise<void> {
    await this.http.patch(`/OperationType/deactivate?id=${id}`, {});
  }

  async addOperationType(operationType: CreatingOperationTypeDTO): Promise<void> {
    await this.http.post("/OperationType", operationType);
  }

  async searchOperationTypes(query: Record<string, string>): Promise<OperationType[]> {
    let queryString = new URLSearchParams(query).toString();
    let res = await this.http.get<OperationType[]>(`/OperationType/search?${queryString}`);
    return res.data;
  }

  async updateOperationType(operationType: UpdateOperationTypeDTO): Promise<void> {
    await this.http.patch(`/OperationType/${operationType.Id}`, operationType);
  }
}