import MockAdapter from "axios-mock-adapter";

import "reflect-metadata";

import { CreatingStaffDTO } from "../../../src/dto/CreatingStaffDTO";
import { PendingStaffChangesDTO } from "../../../src/dto/PendingStaffChangesDTO";
import {
  HttpService,
  Response,
} from "../../../src/service/IService/HttpService";
import { StaffService } from "../../../src/service/staffService";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import axios from "axios";

describe("StaffService", () => {
  let staffService: StaffService;
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

    staffService = new StaffService(mockHttp);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe("getStaffs", () => {
    it("should fetch staff members successfully", async () => {
      const mockStaffs = [
        { id: "1", name: "Dr. John Doe" },
        { id: "2", name: "Dr. Jane Smith" },
      ];

      const mockResponse: Response<typeof mockStaffs> = {
        status: 200,
        statusText: "OK",
        data: mockStaffs,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result = await staffService.getStaffs();

      expect(mockHttp.get).toHaveBeenCalledWith("/staff/search");
      expect(result).toEqual(mockStaffs);
    });
  });

  describe("addStaff", () => {
    it("should add a new staff member", async () => {
      const newStaff: CreatingStaffDTO = {
        licenseNumber: "12345",
        specializationDescription: "Cardiology",
        email: "doctor@example.com",
        role: "Doctor",
        phoneNumber: "123456789",
        firstName: "John",
        lastName: "Doe",
      };

      await staffService.addStaff(newStaff);

      expect(mockHttp.post).toHaveBeenCalledWith("/Staff", newStaff);
    });
  });

  describe("searchStaffs", () => {
    it("should search staff members with query parameters", async () => {
      const mockStaffs = [{ id: "1", name: "Dr. John Doe" }];
      const searchQuery = { name: "John" };

      const mockResponse: Response<typeof mockStaffs> = {
        status: 200,
        statusText: "OK",
        data: mockStaffs,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result = await staffService.searchStaffs(searchQuery);

      expect(mockHttp.get).toHaveBeenCalledWith("/staff/search?name=John");
      expect(result).toEqual(mockStaffs);
    });
  });

  describe("deleteStaff", () => {
    it("should delete a staff member by id", async () => {
      const staffId = "1";

      await staffService.deleteStaff(staffId);

      expect(mockHttp.delete).toHaveBeenCalledWith(`/staff/${staffId}`);
    });
  });

  describe("editStaff", () => {
    it("should edit staff details", async () => {
      const licenseNumber = "12345";
      const changes: PendingStaffChangesDTO = {
        email: { value: "newemail@example.com" },
        phoneNumber: { number: "987654321" },
        specialization: "Dermatology",
      };

      const mockResponse: Response<string> = {
        status: 200,
        statusText: "OK",
        data: "Staff updated successfully",
      };

      mockHttp.patch.mockResolvedValue(mockResponse);

      const result = await staffService.editStaff(licenseNumber, changes);

      expect(mockHttp.patch).toHaveBeenCalledWith(
        `/staff/update/${licenseNumber}`,
        changes
      );
      expect(result).toEqual("Staff updated successfully");
    });
  });

  describe("deactivateStaff", () => {
    it("should deactivate a staff member", async () => {
      const staffId = "1";

      await staffService.deactivateStaff(staffId);

      expect(mockHttp.patch).toHaveBeenCalledWith(
        `/staff/deactivate/${staffId}`,
        {}
      );
    });
  });

  describe("getSpecializations", () => {
    it("should fetch all specializations", async () => {
      const mockSpecializations = [
        { description: "Cardiology" },
        { description: "Dermatology" },
      ];

      const mockResponse: Response<typeof mockSpecializations> = {
        status: 200,
        statusText: "OK",
        data: mockSpecializations,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result = await staffService.getSpecializations();

      expect(mockHttp.get).toHaveBeenCalledWith("/specialization");
      expect(result).toEqual(["Cardiology", "Dermatology"]);
    });
  });

  describe("confirmProfileUpdate", () => {
    it("should confirm a staff profile update", async () => {
      const token = "testToken";

      await staffService.confirmProfileUpdate(token);

      expect(mockHttp.get).toHaveBeenCalledWith("/staff/confirm-update", {
        params: { token },
        headers: { withCredentials: "true" },
      });
    });
  });

  describe("getDoctor", () => {
    it("should fetch a specific doctor's information", async () => {
      const doctorId = "1";
      const mockDoctor = { id: doctorId, name: "Dr. John Doe" };

      const mockResponse: Response<typeof mockDoctor> = {
        status: 200,
        statusText: "OK",
        data: mockDoctor,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result = await staffService.getDoctor(doctorId);

      expect(mockHttp.get).toHaveBeenCalledWith(`/staff/doctor/${doctorId}`);
      expect(result).toEqual(mockDoctor);
    });
  });
});
