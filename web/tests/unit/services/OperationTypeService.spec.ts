import MockAdapter from "axios-mock-adapter";

import "reflect-metadata";

import { CreatingOperationTypeDTO } from "../../../src/dto/CreatingOperationTypeDTO";
import { UpdateOperationTypeDTO } from "../../../src/dto/UpdateOperationTypeDTO";
import {
  HttpService,
  Response,
} from "../../../src/service/IService/HttpService";
import { OperationTypeService } from "../../../src/service/operationTypeService";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import axios from "axios";

describe("OperationTypeService", () => {
  let operationTypeService: OperationTypeService;
  let mockHttp: jest.Mocked<HttpService>;
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    mockHttp = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<HttpService>;

    operationTypeService = new OperationTypeService(mockHttp);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe("getOperationTypes", () => {
    it("should fetch all operation types successfully", async () => {
      const mockOperationTypes = [
        { id: "1", name: "Appendectomy" },
        { id: "2", name: "Cataract Surgery" },
      ];

      const mockResponse: Response<typeof mockOperationTypes> = {
        status: 200,
        statusText: "OK",
        data: mockOperationTypes,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result = await operationTypeService.getOperationTypes();

      expect(mockHttp.get).toHaveBeenCalledWith("/OperationType/all");
      expect(result).toEqual(mockOperationTypes);
    });
  });

  describe("deactivateOperationType", () => {
    it("should deactivate an operation type by id", async () => {
      const operationTypeId = "1";

      await operationTypeService.deactivateOperationType(operationTypeId);

      expect(mockHttp.patch).toHaveBeenCalledWith(
        `/OperationType/deactivate?id=${operationTypeId}`,
        {}
      );
    });
  });

  describe("addOperationType", () => {
    it("should add a new operation type", async () => {
      const newOperationType: CreatingOperationTypeDTO = {
        name: "Appendectomy",
        preparation: 30,
        surgery: 60,
        cleaning: 20,
        requiredStaff: 3,
        specialities: ["General Surgery"],
      };

      await operationTypeService.addOperationType(newOperationType);

      expect(mockHttp.post).toHaveBeenCalledWith(
        "/OperationType",
        newOperationType
      );
    });
  });

  describe("searchOperationTypes", () => {
    it("should search operation types with query parameters", async () => {
      const mockOperationTypes = [
        { id: "1", name: "Appendectomy" },
        { id: "2", name: "Cataract Surgery" },
      ];

      const searchQuery = { name: "Appendectomy" };

      const mockResponse: Response<typeof mockOperationTypes> = {
        status: 200,
        statusText: "OK",
        data: mockOperationTypes,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result =
        await operationTypeService.searchOperationTypes(searchQuery);

      expect(mockHttp.get).toHaveBeenCalledWith(
        "/OperationType/search?name=Appendectomy"
      );
      expect(result).toEqual(mockOperationTypes);
    });
  });

  describe("updateOperationType", () => {
    it("should update an operation type", async () => {
      const operationTypeId = "1";
      const updateData: Partial<UpdateOperationTypeDTO> = {
        Name: "Updated Appendectomy",
        RequiredStaff: 4,
      };

      const mockUpdatedOperationType = {
        id: operationTypeId,
        name: "Updated Appendectomy",
        preparation: 30,
        surgery: 60,
        cleaning: 20,
        requiredStaff: 4,
        specialities: ["General Surgery"],
      };

      const mockResponse: Response<typeof mockUpdatedOperationType> = {
        status: 200,
        statusText: "OK",
        data: mockUpdatedOperationType,
      };

      mockHttp.patch.mockResolvedValue(mockResponse);

      const result = await operationTypeService.updateOperationType(
        operationTypeId,
        updateData
      );

      expect(mockHttp.patch).toHaveBeenCalledWith(
        `/OperationType/${operationTypeId}`,
        updateData
      );
      expect(result).toEqual(mockUpdatedOperationType);
    });
  });
});
