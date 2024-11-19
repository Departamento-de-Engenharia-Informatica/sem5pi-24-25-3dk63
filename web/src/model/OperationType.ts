// src/model/OperationType.ts
export interface OperationType {
  id: string;
  name: {
    description: string;
  };
  specializations: string[];
  active: boolean;
  [key: string]: any;

  requiredStaff: {
    requiredNumber: number;
  };
  duration: {
    preparationPhase: number;
    surgeryPhase: number;
    cleaningPhase: number;
    totalDuration: number;
  };
}
