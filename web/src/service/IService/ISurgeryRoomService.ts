import { SurgeryRoom } from "@/model/SurgeryRoom";
import { CreatingSurgeryRoomDTO } from "@/dto/CreatingSurgeryRoomDTO";

export interface ISurgeryRoomService {
  getAll(): Promise<SurgeryRoom[]>;
  getById(id: string): Promise<SurgeryRoom | null>;
  create(data: CreatingSurgeryRoomDTO): Promise<SurgeryRoom>;
  update(id: string, updatedData: Partial<SurgeryRoom>): Promise<SurgeryRoom>;
  delete(id: string): Promise<void>;
  getByNumber(roomNumber: string): Promise<SurgeryRoom | null>;
}
