import "reflect-metadata";
import sinon, { stub } from "sinon";
import { beforeEach, describe, expect, it } from "vitest";

import { TYPES } from "../../../src/inversify/types";
import { container } from "../../../src/inversify";
import { HttpService } from "../../../src/service/IService/HttpService";
import { IPatientService } from "../../../src/service/IService/IPatientService";
import { PatientUser } from "../../../src/model/PatientUser";

describe("PatientService - getAppointments and getMedicalRecords", () => {
  let service: IPatientService;
  let http: HttpService;

  beforeEach(() => {
    sinon.restore();
    service = container.get<IPatientService>(TYPES.patientService);
    http = container.get<HttpService>(TYPES.api);
  });

  it("should fetch and return patient appointments", async () => {
    const mockAppointments: PatientUser[] = [
        { id: { value: "1" }, appointmentHistoryList: [{}], active: true } as PatientUser,
        { id: { value: "2" }, appointmentHistoryList: [{}], active: true } as PatientUser,
      ];

    const getStub = stub(http, "get").resolves({
      status: 200,
      statusText: "OK",
      data: mockAppointments,
    });

    const result = await service.getAppointments();

    expect(getStub.calledOnceWith(`/patients/appointments`)).toBe(true);
    expect(result).toEqual(mockAppointments);
  });

  it("should fetch and return patient medical records", async () => {
    const mockMedicalRecords: PatientUser[] = [
        { id: { value: "1" }, appointmentHistoryList: [{}], active: true } as PatientUser,
        { id: { value: "2" }, appointmentHistoryList: [{}], active: true } as PatientUser,
      ];

    const getStub = stub(http, "get").resolves({
      status: 200,
      statusText: "OK",
      data: mockMedicalRecords,
    });

    const result = await service.getMedicalRecords();

    expect(getStub.calledOnceWith(`/patients/medicalhistory`)).toBe(true);
    expect(result).toEqual(mockMedicalRecords);
  });
});
