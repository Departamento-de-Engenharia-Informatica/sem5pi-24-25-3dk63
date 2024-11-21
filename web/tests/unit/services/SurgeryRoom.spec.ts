import "reflect-metadata";

import MockAdapter from "axios-mock-adapter";

import { TYPES } from "../../../src/inversify/types";

import { CreatingSurgeryRoomDTO } from "../../../src/dto/CreatingSurgeryRoomDTO";
import { SurgeryRoom } from "../../../src/model/SurgeryRoom";
import {
  HttpService,
  Response,
} from "../../../src/service/IService/HttpService";
import { SurgeryRoomService } from "../../../src/service/surgeryRoomService";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import axios from "axios";

describe("SurgeryRoomService", () => {
  let surgeryRoomService: SurgeryRoomService;
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

    surgeryRoomService = new SurgeryRoomService(mockHttp);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe("getAll", () => {
    it("should fetch all surgery rooms successfully", async () => {
      const mockSurgeryRooms: SurgeryRoom[] = [
        {
          roomId: { value: "1" },
          roomNumber: { value: "101" },
          type: "General",
          capacity: { value: 2 },
          assignedEquipment: [],
          currentStatus: "Available",
          maintenanceSlots: [],
        },
      ];

      const mockResponse: Response<typeof mockSurgeryRooms> = {
        status: 200,
        statusText: "OK",
        data: mockSurgeryRooms,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result = await surgeryRoomService.getAll();

      expect(mockHttp.get).toHaveBeenCalledWith("/SurgeryRoom");
      expect(result).toEqual(mockSurgeryRooms);
    });
  });

  describe("getById", () => {
    it("should fetch a surgery room by ID successfully", async () => {
      const roomId = "1";
      const mockSurgeryRoom: SurgeryRoom = {
        roomId: { value: "1" },
        roomNumber: { value: "101" },
        type: "General",
        capacity: { value: 2 },
        assignedEquipment: [],
        currentStatus: "Available",
        maintenanceSlots: [],
      };

      const mockResponse: Response<typeof mockSurgeryRoom> = {
        status: 200,
        statusText: "OK",
        data: mockSurgeryRoom,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result = await surgeryRoomService.getById(roomId);

      expect(mockHttp.get).toHaveBeenCalledWith(`/SurgeryRoom/${roomId}`);
      expect(result).toEqual(mockSurgeryRoom);
    });
  });

  describe("create", () => {
    it("should create a new surgery room successfully", async () => {
      const mockRequest: CreatingSurgeryRoomDTO = {
        roomNumber: { value: "202" },
        type: { value: "ICU" },
        capacity: { value: 4 },
        assignedEquipment: [
          { name: "Ventilator", type: "Respiratory", isOperational: true },
        ],
        currentStatus: { value: "Available" },
      };

      const mockResponse: SurgeryRoom = {
        roomId: { value: "2" },
        roomNumber: { value: "202" },
        type: "ICU",
        capacity: { value: 4 },
        assignedEquipment: [
          { name: "Ventilator", type: "Respiratory", isOperational: true },
        ],
        currentStatus: "Available",
        maintenanceSlots: [],
      };

      const mockHttpResponse: Response<typeof mockResponse> = {
        status: 201,
        statusText: "Created",
        data: mockResponse,
      };

      mockHttp.post.mockResolvedValue(mockHttpResponse);

      const result = await surgeryRoomService.create(mockRequest);

      expect(mockHttp.post).toHaveBeenCalledWith("/SurgeryRoom", mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("delete", () => {
    it("should delete a surgery room successfully", async () => {
      const roomId = "1";
      const mockHttpResponse: Response<null> = {
        status: 204,
        statusText: "No Content",
        data: null,
      };

      mockHttp.delete.mockResolvedValue(mockHttpResponse);

      await surgeryRoomService.delete(roomId);

      expect(mockHttp.delete).toHaveBeenCalledWith(`/SurgeryRoom/${roomId}`);
    });
  });

  describe("getByNumber", () => {
    it("should fetch a surgery room by number successfully", async () => {
      const roomNumber = "101";
      const mockSurgeryRoom: SurgeryRoom = {
        roomId: { value: "1" },
        roomNumber: { value: "101" },
        type: "General",
        capacity: { value: 2 },
        assignedEquipment: [],
        currentStatus: "Available",
        maintenanceSlots: [],
      };

      const mockResponse: Response<typeof mockSurgeryRoom> = {
        status: 200,
        statusText: "OK",
        data: mockSurgeryRoom,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result = await surgeryRoomService.getByNumber(roomNumber);

      expect(mockHttp.get).toHaveBeenCalledWith(
        `/SurgeryRoom/number/${roomNumber}`
      );
      expect(result).toEqual(mockSurgeryRoom);
    });
  });
});
