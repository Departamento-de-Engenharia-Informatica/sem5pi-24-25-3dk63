// src/model/OperationType.ts
export interface OperationType {
    name: {
      value: string; // Adjust the type if OperationName in C# is more specific
    };
    duration: {
      value: number; // Adjust the type if Duration in C# represents a different format, e.g., "hh:mm:ss"
    };
    requiredStaff: {
      value: number; // Adjust the type based on the RequiredStaff definition in C#
    };
    specializationId: {
      value: string; // Assuming SpecializationId is a unique identifier
    };
    active: boolean;
    [key: string]: any;
  }
  