// src/dto/CreatingSurgeryRoomDTO.ts
export interface CreatingSurgeryRoomDTO {
  roomNumber: {
    value: string;
  };
  type: {
    value: string;
  };
  capacity: {
    value: number;
  };
  assignedEquipment: {
    name: string;
    type: string;
    isOperational: boolean;
  }[];
  currentStatus: {
    value: string;
  };
}
