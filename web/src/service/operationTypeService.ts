import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import type { HttpService } from "./IService/HttpService";
import { IOperationTypeService } from "./IService/IOperationTypeService";
import { OperationType } from "@/model/OperationType";
import { CreatingOperationTypeDTO } from "@/dto/CreatingOperationTypeDTO";
import { UpdateOperationTypeDTO } from "@/dto/UpdateOperationTypeDTO";
import routeconfiguration from "@/config/routeconfiguration.json";

@injectable()
export class OperationTypeService implements IOperationTypeService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getOperationTypes(): Promise<OperationType[]> {
    const res = await this.http.get<OperationType[]>(routeconfiguration.OPERATION_TYPE_ALL);
    return res.data;
  }

  async deactivateOperationType(id: string): Promise<void> {
    await this.http.patch(`${routeconfiguration.DEACTIVATE_OPERATION_TYPE}?id=${id}`, {});
  }

  async addOperationType(operationType: CreatingOperationTypeDTO): Promise<void> {
    await this.http.post(routeconfiguration.OPERATION_TYPE, operationType);
  }

  async searchOperationTypes(query: Record<string, string>): Promise<OperationType[]> {
    let queryString = new URLSearchParams(query).toString();
    let res = await this.http.get<OperationType[]>(`${routeconfiguration.SEARCH_OPERATION_TYPE}?${queryString}`);
    return res.data;
  }

  async updateOperationType(id: string, operationType: Partial<UpdateOperationTypeDTO>): Promise<OperationType> {
    const res = await this.http.patch<OperationType>(`${routeconfiguration.OPERATION_TYPE}/${id}`, operationType);
    console.log("Operation Type updated:", id);
    return res.data;
  }
}