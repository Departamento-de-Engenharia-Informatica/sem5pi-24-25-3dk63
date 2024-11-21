import "reflect-metadata";

import MockAdapter from "axios-mock-adapter";

import { TYPES } from "../../../src/inversify/types";

import { Specialization } from "../../../src/model/Specialization";
import {
  HttpService,
  Response,
} from "../../../src/service/IService/HttpService";
import { SpecializationsService } from "../../../src/service/specializationsService";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import axios from "axios";

describe("SpecializationsService", () => {
  let specializationsService: SpecializationsService;
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

    specializationsService = new SpecializationsService(mockHttp);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe("getSpecializations", () => {
    it("should fetch all specializations successfully", async () => {
      const mockSpecializations: Specialization[] = [
        { id: "1", description: "Cardiology", sequentialNumber: 1 },
        { id: "2", description: "Neurology", sequentialNumber: 2 },
      ];

      const mockResponse: Response<typeof mockSpecializations> = {
        status: 200,
        statusText: "OK",
        data: mockSpecializations,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result = await specializationsService.getSpecializations();

      expect(mockHttp.get).toHaveBeenCalledWith("/specialization");
      expect(result).toEqual(mockSpecializations);
    });
  });

  describe("getSpecializationById", () => {
    it("should fetch a specialization by ID successfully", async () => {
      const specializationId = "1";
      const mockSpecialization: Specialization = {
        id: specializationId,
        description: "Cardiology",
        sequentialNumber: 1,
      };

      const mockResponse: Response<typeof mockSpecialization> = {
        status: 200,
        statusText: "OK",
        data: mockSpecialization,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result =
        await specializationsService.getSpecializationById(specializationId);

      expect(mockHttp.get).toHaveBeenCalledWith(
        `/specialization/${specializationId}`
      );
      expect(result).toEqual(mockSpecialization);
    });
  });
});
