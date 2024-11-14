import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import type { HttpService } from "./IService/HttpService";
import { ISurgeryRoomService } from "./IService/ISurgeryRoomService";
import { SurgeryRoom } from "@/model/SurgeryRoom";
import { CreatingSurgeryRoomDTO } from "@/dto/CreatingSurgeryRoomDTO";
import axios, { AxiosError } from "axios";
import * as fs from 'fs';
import * as path from 'path';

@injectable()
export class SurgeryRoomService implements ISurgeryRoomService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getAll(): Promise<SurgeryRoom[]> {
    const res = await this.http.get<SurgeryRoom[]>("/SurgeryRoom");
    return res.data;
  }

  async getById(id: string): Promise<SurgeryRoom | null> {
    try {
      const res = await this.http.get<SurgeryRoom>(`/SurgeryRoom/${id}`);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async create(data: CreatingSurgeryRoomDTO): Promise<SurgeryRoom> {
    const res = await this.http.post<SurgeryRoom>("/SurgeryRoom", data);
    return res.data;
  }

  async update(id: string, updatedData: Partial<SurgeryRoom>): Promise<SurgeryRoom> {
    const res = await this.http.put<SurgeryRoom>(`/SurgeryRoom/${id}`, updatedData);
    console.log("Surgery room updated:", res.data);
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`/SurgeryRoom/${id}`);
    console.log("Surgery room deleted:", id);
  }


  async getByNumber(roomNumber: string): Promise<SurgeryRoom | null> {
    try {
      const res = await this.http.get<SurgeryRoom>(`/SurgeryRoom/number/${roomNumber}`);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createJson(): Promise<void> {
    try {
      const res = await this.http.get<SurgeryRoom>(`/SurgeryRoom/createJson`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
      }
      throw error;
    }
  }


 /* async createJson(data: SurgeryRoom[]): Promise<void> {

    //ordenar as salas por ordem crescente
    data.sort((a, b) => {
      return Number(a.roomNumber) - Number(b.roomNumber);
    });
    const surgeryRoomNames = data.map((room) => room.roomNumber);
    const map = createMap(data);
  
    const width = map[0].length - 1;
    const height = map.length;

    // Estrutura do JSON a ser criado
    const newJson = {
      groundTextureUrl: "/../src/Floor/textures/ground.jpg",
      wallTextureUrl: "/../src/Floor/textures/wall.jpg",
      doorTextureUrl: "/../src/Floor/textures/door.jpg",
      surgeryRoomDoorTextureUrl: "/../src/Floor/textures/surgeryDoor.png",
      camaTextureUrl: "/../src/Floor/textures/bed.obj",
      aderecoTextureUrl: "/../src/Floor/textures/adereco.obj",
      patientTextureUrl: "/../src/Floor/textures/ManColors.png",
      patientModelOBJUrl: "/../src/Floor/textures/Man.obj",
  
      size: {
        width: width,
        height: height,
      },
      map: [map],
  
      initialPosition: [4, 5],
      initialDirection: 0.0,
      exitLocation: [-0.5, 6],

      // Incluir apenas os nomes das salas no JSON
      surgeryRooms: surgeryRoomNames
    };

      //guardar o JSON num ficheiro
  
    console.log("Criando o JSON: ", newJson);

  }*/
}

/*function createMap(data: SurgeryRoom[]): number[][] {
  console.log("Creating map with data:", data);
  // Definir os módulos (os arrays de salas)
  const modulo0 = [
    [3, 2, 2, 2, 3, 5, 2, 3, 2, 2, 2, 1],
  ];

  const moduloIntermedio = [
    [3, 2, 2, 2, 1, 0, 0, 3, 2, 2, 2, 1],
  ];

  const moduloFim = [
    [2, 2, 2, 2, 2, 5, 2, 2, 2, 2, 2, 0],
  ];

  const modulo1 = [
    [1, 0, 0, 0, 6, 0, 0, 6, 0, 0, 0, 1],
    [1, 0, 9, 0, 6, 0, 0, 6, 0, 9, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
  ];

  const modulo2 = [
    [1, 0, 0, 0, 6, 0, 0, 8, 0, 0, 0, 1],
    [1, 0, 9, 0, 6, 0, 0, 8, 0, 4, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
  ];

  const modulo3 = [
    [1, 0, 0, 0, 8, 0, 0, 6, 0, 0, 0, 1],
    [1, 0, 9, 0, 8, 0, 0, 6, 0, 4, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
  ];

  const modulo4 = [
    [1, 0, 0, 0, 7, 0, 0, 8, 0, 0, 0, 1],
    [1, 0, 4, 0, 7, 0, 0, 8, 0, 4, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
  ];

  // Inicialize o mapa com o modulo0 (inicial)
  let mapa: number[][] = [];
  mapa.push(...modulo0);

  // Iterar sobre as salas em pares
  for (let i = 0; i < data.length; i += 2) {
    const room1 = data[i];
    console.log("Room1: ", room1);
    const room2 = data[i + 1] || { currentStatus    : 'Occupied' }; // Considerar a última sala como "Occupied" se for ímpar
    console.log("Room2: ", room2);
    // Verificar os estados das salas e adicionar o módulo adequado
    if (room1.currentStatus === 'Occupied' && room2.currentStatus === 'Occupied') {
      mapa.push(...modulo1); // Ambas fechadas
      console.log("Ambas fechadas");
    } else if (room1.currentStatus === 'Available' && room2.currentStatus === 'Occupied') {
      console.log("Aberta + Fechada (esquerda)");
      mapa.push(...modulo2); // Aberta + Fechada (esquerda)
    } else if (room1.currentStatus === 'Occupied' && room2.currentStatus === 'Available') {
      console.log("Fechada + Aberta (direita)");
      mapa.push(...modulo3); // Fechada + Aberta (direita)
    } else if (room1.currentStatus === 'Available' && room2.currentStatus === 'Available') {
      console.log("Ambas abertas");
      mapa.push(...modulo4); // Ambas abertas
    }

    // Adiciona o módulo intermediário após cada par de salas, exceto o último par
    if (i + 2 < data.length) {
      mapa.push(...moduloIntermedio);
    }
  }

  // Adiciona o módulo final
  mapa.push(...moduloFim);

  // Retorna o mapa completo
  return mapa;
}*/
