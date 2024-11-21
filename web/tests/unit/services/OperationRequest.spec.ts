import MockAdapter from "axios-mock-adapter";

import "reflect-metadata";

import { CreatingOperationRequestDTO } from "../../../src/dto/CreatingOperationRequestDTO";
import { UpdateOperationRequestDTO } from "../../../src/dto/UpdateOperationRequestDTO";
import {
  HttpService,
  Response,
} from "../../../src/service/IService/HttpService";
import { OperationRequestService } from "../../../src/service/operationRequestService";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import axios from "axios";

describe("OperationRequestService", () => {
  let operationRequestService: OperationRequestService;
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

    operationRequestService = new OperationRequestService(mockHttp);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe("getOperationRequests", () => {
    it("should fetch all operation requests successfully", async () => {
      const mockOperationRequests = [
        { id: "1", priority: "High", deadline: "2024-12-01T12:00:00Z" },
        { id: "2", priority: "Medium", deadline: "2024-12-02T12:00:00Z" },
      ];

      const mockResponse: Response<typeof mockOperationRequests> = {
        status: 200,
        statusText: "OK",
        data: mockOperationRequests,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result = await operationRequestService.getOperationRequests();

      expect(mockHttp.get).toHaveBeenCalledWith("/OperationRequest/doctor", {
        headers: { withCredentials: "true" },
      });
      expect(result).toEqual(mockOperationRequests);
    });
  });

  describe("searchOperationRequests", () => {
    it("should search operation requests with query parameters", async () => {
      const mockOperationRequests = [
        { id: "1", priority: "High", deadline: "2024-12-01T12:00:00Z" },
      ];

      const searchQuery = { priority: "High" };

      const mockResponse: Response<typeof mockOperationRequests> = {
        status: 200,
        statusText: "OK",
        data: mockOperationRequests,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result =
        await operationRequestService.searchOperationRequests(searchQuery);

      expect(mockHttp.get).toHaveBeenCalledWith(
        "/OperationRequest/search?priority=High",
        { headers: { withCredentials: "true" } }
      );
      expect(result).toEqual(mockOperationRequests);
    });
  });

  describe("createOperationRequest", () => {
    it("should create a new operation request", async () => {
      const newOperationRequest: CreatingOperationRequestDTO = {
        deadline: { value: "2024-12-01T12:00:00Z" },
        priority: { value: "High" },
        licenseNumber: { value: "12345" },
        medicalRecordNumber: { value: "67890" },
        operationTypeId: { value: "54321" },
      };

      await operationRequestService.createOperationRequest(newOperationRequest);

      expect(mockHttp.post).toHaveBeenCalledWith(
        "/OperationRequest",
        newOperationRequest
      );
    });
  });

  describe("deleteOperationRequest", () => {
    it("should delete an operation request by id", async () => {
      const requestId = "1";

      await operationRequestService.deleteOperationRequest(requestId);

      expect(mockHttp.delete).toHaveBeenCalledWith(
        `/OperationRequest/${requestId}`
      );
    });
  });

  describe("editOperationRequest", () => {
    it("should edit an operation request", async () => {
      const updateData: UpdateOperationRequestDTO = {
        Id: "1",
        Priority: "Medium",
        Deadline: "2024-12-02T12:00:00Z",
      };

      await operationRequestService.editOperationRequest(updateData);

      expect(mockHttp.patch).toHaveBeenCalledWith(
        `/OperationRequest/${updateData.Id}`,
        updateData
      );
    });
  });

  describe("deactivateOperationRequest", () => {
    it("should deactivate an operation request by id", async () => {
      const requestId = "1";

      await operationRequestService.deactivateOperationRequest(requestId);

      expect(mockHttp.patch).toHaveBeenCalledWith(
        `/OperationRequest/deactivate/${requestId}`,
        {}
      );
    });
  });
});
