import "reflect-metadata";
import sinon, { stub } from "sinon";
import { beforeEach, describe, expect, it } from "vitest";

import { TYPES } from "../../../src/inversify/types";
import { container } from "../../../src/inversify";
import { HttpService } from "../../../src/service/IService/HttpService";
import { IOperationTypeService } from "../../../src/service/IService/IOperationTypeService";
import { OperationType } from "../../../src/model/OperationType";
import { CreatingOperationTypeDTO } from "../../../src/dto/CreatingOperationTypeDTO";

describe("OperationType Service", () => {
  let service: IOperationTypeService;
  let http: HttpService;

  beforeEach(() => {
    sinon.restore();
    service = container.get<IOperationTypeService>(TYPES.operationTypeService);
    http = container.get<HttpService>(TYPES.api);
  });

  it("should fetch and return operation types", async () => {
    const mockData: OperationType[] = [
      {
        id: "1",
        name: { description: "Surgery" },
        specialization: { value: "Cardiology" },
        active: true,
        requiredStaff: { requiredNumber: 3 },
        duration: {
          preparationPhase: 15,
          surgeryPhase: 120,
          cleaningPhase: 30,
          totalDuration: 165,
        },
      },
    ];

    stub(http, "get").resolves({
      status: 200,
      statusText: "OK",
      data: mockData,
    });

    const result = await service.getOperationTypes();
    expect(result).toEqual(mockData);
  });

  it("should deactivate an operation type", async () => {
    const id = "1";
    const patchStub = stub(http, "patch").resolves({
      status: 204,
      statusText: "No Content",
      data: null,
    });

    await service.deactivateOperationType(id);
    expect(patchStub.calledOnceWith(`/OperationType/deactivate?id=${id}`, {})).toBe(true);
  });

  it("should add a new operation type", async () => {
    const newOperationType: CreatingOperationTypeDTO = {
      name: "Emergency Surgery",
      preparation: 15,
      surgery: 120,
      cleaning: 30,
      requiredStaff: 3,
      speciality: "General"
    };
    const postStub = stub(http, "post").resolves({
      status: 201,
      statusText: "Created",
      data: null,
    });

    await service.addOperationType(newOperationType);
    expect(postStub.calledOnceWith("/OperationType", newOperationType)).toBe(true);
  });

  it("should search and return filtered operation types", async () => {
    const mockData: OperationType[] = [
      {
        id: "1",
        name: { description: "Surgery" },
        specialization: { value: "Cardiology" },
        active: true,
        requiredStaff: { requiredNumber: 3 },
        duration: {
          preparationPhase: 15,
          surgeryPhase: 120,
          cleaningPhase: 30,
          totalDuration: 165,
        },
      },
    ];
    const query = { name: "Surgery" };
    const queryString = new URLSearchParams(query).toString();

    stub(http, "get").resolves({
      status: 200,
      statusText: "OK",
      data: mockData,
    });

    const result = await service.searchOperationTypes(query);
    expect(result).toEqual(mockData);
  });

  it("should handle errors when fetching operation types", async () => {
    stub(http, "get").rejects(new Error("Network error"));

    await expect(service.getOperationTypes()).rejects.toThrow("Network error");
  });
});
