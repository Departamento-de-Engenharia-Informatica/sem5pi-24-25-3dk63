// src/model/OperationType.ts
export interface OperationType {
    name: {
      description: string; // Adjust the type if OperationName in C# is more specific
    };
    specialization: {
      value: string; // Adjust the type if Duration in C# represents a different format, e.g., "hh:mm:ss"
    };
    active: boolean;
    [key: string]: any;

    requiredStaff: {
      requiredNumber: number; // Adjust the type based on the RequiredStaff definition in C#
    };
    duration: {
      preparationPhase: number;
      surgeryPhase: number;
      cleaningPhase: number;      
      totalDuration: number;
    };

  }
  