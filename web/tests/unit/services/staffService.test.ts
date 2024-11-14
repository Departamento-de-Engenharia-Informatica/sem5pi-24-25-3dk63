import "reflect-metadata";
import sinon, { stub } from "sinon";
import { beforeEach, describe, expect, it } from "vitest";

import { TYPES } from "../../../src/inversify/types";
import { container } from "../../../src/inversify";
import { HttpService } from "../../../src/service/IService/HttpService";
import { IStaffService } from "../../../src/service/IService/IStaffService";
import { PendingStaffChangesDTO } from "../../../src/dto/PendingStaffChangesDTO";

describe("Staff Service", () => {
  let service: IStaffService;
  let http: HttpService;

  beforeEach(() => {
    sinon.restore();
    service = container.get<IStaffService>(TYPES.staffService);
    http = container.get<HttpService>(TYPES.api);
  });

  it("should edit staff and return updated license number", async () => {
    const licenseNumber = "12345";
    const changes: PendingStaffChangesDTO = {
      email: { value: "updated.email@example.com" },
      phoneNumber: { number: "987654321" },
      specialization: "Updated Specialization",
    };
    const updatedId = "12345";

    // Stub para simular o patch no servidor
    const patchStub = stub(http, "patch").resolves({
      status: 200,
      statusText: "OK",
      data: updatedId,
    });

    const result = await service.editStaff(licenseNumber, changes);

    expect(patchStub.calledOnceWith(`/staff/update/${licenseNumber}`, changes)).toBe(true);
    expect(result).toBe(updatedId);
  });

  it("should deactivate staff", async () => {
    const staffId = "12345";

    // Stub para simular o patch no servidor
    const patchStub = stub(http, "patch").resolves({
      status: 204,
      statusText: "No Content",
      data: null,
    });

    await service.deactivateStaff(staffId);

    expect(patchStub.calledOnceWith(`/staff/deactivate/${staffId}`, {})).toBe(true);
  });
});
