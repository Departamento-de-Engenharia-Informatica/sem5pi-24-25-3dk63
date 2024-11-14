import "reflect-metadata";

import sinon, { stub } from "sinon";
import { beforeEach, describe, expect, it } from "vitest";

import { TYPES } from "../../../src/inversify/types";
import { container } from "../../../src/inversify";
import { Specialization } from "../../../src/model/Specialization";
import { HttpService } from "../../../src/service/IService/HttpService";
import { ISpecializationService } from "../../../src/service/IService/ISpecializationService";

describe("Specializations Service", () => {
  beforeEach(() => {
    // Restaura o estado de todos os stubs entre os testes
    sinon.restore();
  });

  it("should fetch and return specializations", async () => {
    // Dados simulados de resposta
    const mockData: Specialization[] = [
      { id: "1", description: "Cardiology", sequentialNumber: 1 },
      { id: "2", description: "Neurology", sequentialNumber: 2 },
    ];

    // Obtenha o serviço e o HttpService do container do Inversify
    const service = container.get<ISpecializationService>(TYPES.specializationsService);
    const http = container.get<HttpService>(TYPES.api);

    // Stub do método `get` do HttpService
    stub(http, "get").resolves({
      status: 200,
      statusText: "OK",
      data: mockData,
    });

    // Executa o método a ser testado
    const result = await service.getSpecializations();

    // Verifica se o resultado é igual aos dados simulados
    expect(result).toEqual(mockData);
  });

  it("should handle errors when fetching specializations", async () => {
    // Obtenha o serviço e o HttpService do container do Inversify
    const service = container.get<ISpecializationService>(TYPES.specializationsService);
    const http = container.get<HttpService>(TYPES.api);

    // Configura o stub para lançar um erro simulado
    stub(http, "get").rejects(new Error("Network error"));

    // Verifica se o erro é lançado corretamente
    await expect(service.getSpecializations()).rejects.toThrow("Network error");
  });
});
