// src/model/SurgeryRoom.ts
export interface SurgeryRoom {
  roomId: {
    value: string;
  };
  roomNumber: {
    value: string;
  };
  type: string;
  capacity: {
    value: number;
  };
  assignedEquipment: Equipment[];
  currentStatus: string;
  maintenanceSlots: MaintenanceSlot[];
  [key: string]: any;
}

export interface Equipment {
  name: string;
  type: string;
  isOperational: boolean;
  [key: string]: any;
}

export interface MaintenanceSlot {
  startTime: string;
  endTime: string;
  [key: string]: any;
}
