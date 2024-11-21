import * as fs from "fs";
import * as path from "path";
import { inject, injectable } from "inversify";

import { TYPES } from "../inversify/types";
import { CreatingSurgeryRoomDTO } from "@/dto/CreatingSurgeryRoomDTO";
import { SurgeryRoom } from "@/model/SurgeryRoom";

import type { HttpService } from "./IService/HttpService";
import { ISurgeryRoomService } from "./IService/ISurgeryRoomService";

import axios, { AxiosError } from "axios";

@injectable()
export class SurgeryRoomService implements ISurgeryRoomService {
  constructor(@inject(TYPES.api) private http: HttpService) {}

  async getAll(): Promise<SurgeryRoom[]> {
    const res = await this.http.get<SurgeryRoom[]>(routeconfiguration.SURGERY_ROOM);
    return res.data;
  }

  async getById(id: string): Promise<SurgeryRoom | null> {
    try {
      const res = await this.http.get<SurgeryRoom>(`${routeconfiguration.SURGERY_ROOM}/${id}`);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async create(data: CreatingSurgeryRoomDTO): Promise<SurgeryRoom> {
    const res = await this.http.post<SurgeryRoom>(routeconfiguration.SURGERY_ROOM, data);
    return res.data;
  }

  async update(
    id: string,
    updatedData: Partial<SurgeryRoom>
  ): Promise<SurgeryRoom> {
    const res = await this.http.put<SurgeryRoom>(
      `/SurgeryRoom/${id}`,
      updatedData
    );
    console.log("Surgery room updated:", res.data);
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`${routeconfiguration.SURGERY_ROOM}/${id}`);
    console.log("Surgery room deleted:", id);
  }

  async getByNumber(roomNumber: string): Promise<SurgeryRoom | null> {
    try {
      const res = await this.http.get<SurgeryRoom>(
        `/SurgeryRoom/number/${roomNumber}`
      );
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
      const res = await this.http.get<SurgeryRoom>(routeconfiguration.SURGERY_ROOM_CREATEJSON);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
      }
      throw error;
    }
  }
}
