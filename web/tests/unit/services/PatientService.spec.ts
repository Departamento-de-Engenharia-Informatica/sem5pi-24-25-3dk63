import MockAdapter from "axios-mock-adapter";

import "reflect-metadata";

import { PatientUpdateDTO } from "../../../src/dto/PatientUpdateDTO";
import { RegisterPatientDTO } from "../../../src/dto/RegisterPatientDTO";
import {
  HttpService,
  Response,
} from "../../../src/service/IService/HttpService";
import { PatientService } from "../../../src/service/patientService";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import axios from "axios";

describe("PatientService", () => {
  let patientService: PatientService;
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

    patientService = new PatientService(mockHttp);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe("getPatients", () => {
    it("should fetch patients successfully", async () => {
      const mockPatients = [
        { id: "1", name: "John Doe" },
        { id: "2", name: "Jane Smith" },
      ];

      const mockResponse: Response<typeof mockPatients> = {
        status: 200,
        statusText: "OK",
        data: mockPatients,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result = await patientService.getPatients();

      expect(mockHttp.get).toHaveBeenCalledWith("/patients");
      expect(result).toEqual(mockPatients);
    });
  });

  describe("searchPatients", () => {
    it("should search patients with query parameters", async () => {
      const mockPatients = [{ id: "1", name: "John Doe" }];
      const searchQuery = { name: "John" };

      const mockResponse: Response<typeof mockPatients> = {
        status: 200,
        statusText: "OK",
        data: mockPatients,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result = await patientService.searchPatients(searchQuery);

      expect(mockHttp.get).toHaveBeenCalledWith("/patients/search?name=John");
      expect(result).toEqual(mockPatients);
    });
  });

  describe("deletePatient", () => {
    it("should delete a patient by id", async () => {
      const patientId = "1";

      await patientService.deletePatient(patientId);

      expect(mockHttp.delete).toHaveBeenCalledWith(`/patients/${patientId}`);
    });
  });

  describe("updatePatient", () => {
    it("should update a patient", async () => {
      const updateData: PatientUpdateDTO = {
        id: { value: "1" },
        name: {
          firstName: "Updated",
          lastName: "Name",
        },
        personalEmail: { value: "updated@example.com" },
        phoneNumber: { number: "123-456-7890" },
      };

      await patientService.updatePatient(updateData.id.value, updateData);

      expect(mockHttp.patch).toHaveBeenCalledWith(
        `/patients/${updateData.id.value}`,
        updateData
      );
    });
  });

  describe("createPatient", () => {
    it("should create a new patient", async () => {
      const patientData: RegisterPatientDTO = {
        name: {
          firstName: "Updated",
          lastName: "Name",
        },
        dateOfBirth: { date: "1990-01-01" },
        gender: { gender: "Male" },
        emergencyContact: { emergencyContact: "Emergency Contact" },
        appointmentHistoryList: [],
        medicalHistory: { medicalHistory: "" },
        personalEmail: { value: "updatedname@example.com" },
        phoneNumber: { number: "123-456-7890" },
      };

      const mockResponse: Response<typeof patientData & { id: string }> = {
        status: 201,
        statusText: "Created",
        data: {
          id: "3",
          name: { firstName: "New", lastName: "Patient" },
          dateOfBirth: { date: "1990-01-01" },
          gender: { gender: "Male" },
          emergencyContact: { emergencyContact: "Emergency Contact" },
          appointmentHistoryList: [],
          medicalHistory: { medicalHistory: "" },
          personalEmail: { value: "newpatient@example.com" },
          phoneNumber: { number: "123-456-7890" },
        },
      };

      mockHttp.post.mockResolvedValue(mockResponse);

      const result = await patientService.createPatient(patientData);

      expect(mockHttp.post).toHaveBeenCalledWith(
        "/patients/register-patient",
        patientData
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("getAppointments", () => {
    it("should fetch patient appointments", async () => {
      const mockAppointments = [
        { id: "1", patientId: "123", date: "2023-01-01" },
      ];

      const mockResponse: Response<typeof mockAppointments> = {
        status: 200,
        statusText: "OK",
        data: mockAppointments,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result = await patientService.getAppointments();

      expect(mockHttp.get).toHaveBeenCalledWith("/patients/appointments");
      expect(result).toEqual(mockAppointments);
    });
  });

  describe("getMedicalRecords", () => {
    it("should fetch patient medical records", async () => {
      const mockMedicalRecords = [
        { id: "1", patientId: "123", diagnosis: "Test diagnosis" },
      ];

      const mockResponse: Response<typeof mockMedicalRecords> = {
        status: 200,
        statusText: "OK",
        data: mockMedicalRecords,
      };

      mockHttp.get.mockResolvedValue(mockResponse);

      const result = await patientService.getMedicalRecords();

      expect(mockHttp.get).toHaveBeenCalledWith("/patients/medicalhistory");
      expect(result).toEqual(mockMedicalRecords);
    });
  });
});
