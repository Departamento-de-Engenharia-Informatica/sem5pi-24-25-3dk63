// src/model/OperationType.ts
export interface OperationType {
    name: {
      description: string;
    };
    specialization: {
      value: string;
    };
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
