import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import type { HttpService } from "./IService/HttpService";
import { IOperationTypeService } from "./IService/IOperationTypeService";
import { OperationType } from "@/model/OperationType";

@injectable()
export class OperationTypeService implements IOperationTypeService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getOperationTypes(): Promise<OperationType[]> {
    console.log("OIIIIISERVICE");
    const res = await this.http.get<OperationType[]>("/OperationType");

    return res.data;
  }
}